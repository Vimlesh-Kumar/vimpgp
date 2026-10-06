import * as openpgp from 'openpgp';

type KeyAlgo = 'ecc' | 'rsa';

interface AlgoOptions {
    type: 'ecc' | 'rsa' | 'curve25519';
    curve?: openpgp.EllipticCurveName;
    rsaBits?: number;
}

const NIST_CURVES: Record<number, openpgp.EllipticCurveName> = {
    256: 'nistP256',
    384: 'nistP384',
    521: 'nistP521',
};

/**
 * Translate the UI's algorithm/size selection into valid OpenPGP v6 key options.
 * - ECC size 25519 -> modern `curve25519` type (ed25519/x25519, non-legacy).
 * - ECC size 256/384/521 -> NIST `ecc` curves.
 * - RSA -> clamped to the OpenPGP minimum of 2048 bits.
 */
const buildAlgoOptions = (algo: KeyAlgo, size: number): AlgoOptions => {
    if (algo === 'rsa') {
        return { type: 'rsa', rsaBits: Math.max(2048, size || 4096) };
    }
    if (size === 256 || size === 384 || size === 521) {
        return { type: 'ecc', curve: NIST_CURVES[size] };
    }
    return { type: 'curve25519' };
};

/** Infer a human-friendly usage label for a (sub)key from its public-key algorithm. */
const inferUsage = (algorithm: string): string => {
    const encrypting = ['ecdh', 'x25519', 'x448', 'elgamal', 'rsaEncrypt', 'aeadEncrypt'];
    if (encrypting.includes(algorithm)) return 'encrypt';
    if (algorithm === 'rsaEncryptSign') return 'sign';
    return 'sign';
};

const toIsoOrNull = (value: Date | typeof Infinity | null): string | null => {
    if (value instanceof Date) return value.toISOString();
    return null;
};

export interface KeyComponentInfo {
    id: string;
    fingerprint: string;
    created: string;
    algo: string;
    bits: number;
    curve: string;
    isPrimary: boolean;
    type: string;
    expiry: string | null;
}

export interface PgpKeyRecord {
    id: string;
    fingerprint: string;
    name: string;
    email: string;
    passphrase?: string;
    privateKey: string;
    publicKey: string;
    revocationCertificate: string;
    createdAt: string;
    type: string;
}

export const usePgp = () => {
    const keys = useState<PgpKeyRecord[]>('pgp-keys', () => []);
    const loading = useState<boolean>('pgp-loading', () => false);

    const initKeys = () => {
        if (import.meta.client) {
            const stored = localStorage.getItem('vimpgp_keys');
            if (stored) {
                try {
                    keys.value = JSON.parse(stored);
                } catch (e) {
                    console.error('Failed to parse keys', e);
                }
            }
        }
    };

    const saveKeys = () => {
        if (import.meta.client) {
            localStorage.setItem('vimpgp_keys', JSON.stringify(keys.value));
        }
    };

    const generate = async (
        name: string,
        email: string,
        passphrase: string,
        keyType: KeyAlgo = 'ecc',
        keySize: number = 0,
        expiry: number = 0,
    ) => {
        loading.value = true;
        try {
            const options: openpgp.GenerateKeyOptions & { format: 'armored' } = {
                userIDs: [{ name, email }],
                format: 'armored',
                keyExpirationTime: expiry,
                ...buildAlgoOptions(keyType, keySize),
            };
            if (passphrase) options.passphrase = passphrase;

            const { privateKey, publicKey, revocationCertificate } = await openpgp.generateKey(options);
            const key = await openpgp.readKey({ armoredKey: privateKey });

            const newKey: PgpKeyRecord = {
                id: key.getKeyID().toHex(),
                fingerprint: key.getFingerprint(),
                name,
                email,
                passphrase,
                privateKey,
                publicKey,
                revocationCertificate,
                createdAt: new Date().toISOString(),
                type: keyType,
            };

            keys.value.push(newKey);
            saveKeys();

            return newKey;
        } finally {
            loading.value = false;
        }
    };

    const deleteKey = (id: string) => {
        keys.value = keys.value.filter(k => k.id !== id);
        saveKeys();
    };

    /**
     * Add a real cryptographic subkey to an existing private key.
     * The primary key is unlocked (if protected), the subkey is bound, and the
     * updated key is re-armored (re-encrypting with the same passphrase when needed).
     */
    const generateSubkey = async (
        keyId: string,
        passphrase: string,
        type: 'sign' | 'encrypt',
        algo: KeyAlgo = 'ecc',
        size: number = 25519,
        expiry: number = 0,
    ) => {
        loading.value = true;
        try {
            const record = keys.value.find(k => k.id === keyId);
            if (!record) throw new Error('Key not found');
            if (!record.privateKey) {
                throw new Error('A private key is required to add a subkey. Public-only keys cannot be modified.');
            }

            let privateKey = await openpgp.readPrivateKey({ armoredKey: record.privateKey });
            const wasEncrypted = !privateKey.isDecrypted();
            if (wasEncrypted) {
                if (!passphrase) throw new Error('Passphrase is required to unlock this private key.');
                privateKey = await openpgp.decryptKey({ privateKey, passphrase });
            }

            const updated = await privateKey.addSubkey({
                ...buildAlgoOptions(algo, size),
                sign: type === 'sign',
                keyExpirationTime: expiry > 0 ? expiry : 0,
            });

            const finalKey = wasEncrypted
                ? await openpgp.encryptKey({ privateKey: updated, passphrase })
                : updated;

            record.privateKey = finalKey.armor();
            record.publicKey = finalKey.toPublic().armor();
            saveKeys();

            return true;
        } finally {
            loading.value = false;
        }
    };

    /** Read the primary key and all real subkeys with accurate algorithm/usage/expiry info. */
    const getKeyDetails = async (armoredKey: string): Promise<KeyComponentInfo[]> => {
        const key = await openpgp.readKey({ armoredKey });
        const components: KeyComponentInfo[] = [];

        const pInfo = key.getAlgorithmInfo();
        const pExpiry = await key.getExpirationTime();
        components.push({
            id: key.getKeyID().toHex(),
            fingerprint: key.getFingerprint(),
            created: key.getCreationTime().toISOString(),
            algo: pInfo.algorithm,
            bits: pInfo.bits ?? 0,
            curve: pInfo.curve ?? '',
            isPrimary: true,
            type: 'certify',
            expiry: toIsoOrNull(pExpiry),
        });

        for (const sub of key.getSubkeys()) {
            const ai = sub.getAlgorithmInfo();
            const exp = await sub.getExpirationTime();
            components.push({
                id: sub.getKeyID().toHex(),
                fingerprint: sub.getFingerprint(),
                created: sub.getCreationTime().toISOString(),
                algo: ai.algorithm,
                bits: ai.bits ?? 0,
                curve: ai.curve ?? '',
                isPrimary: false,
                type: inferUsage(ai.algorithm),
                expiry: toIsoOrNull(exp),
            });
        }

        return components;
    };

    const encryptMessage = async (message: string, publicKeys: string[], format: 'armored' | 'binary' = 'armored') => {
        loading.value = true;
        try {
            const encryptionKeys = await Promise.all(
                publicKeys.map(k => openpgp.readKey({ armoredKey: k })),
            );

            const encrypted = await openpgp.encrypt({
                message: await openpgp.createMessage({ text: message }),
                encryptionKeys,
                format,
            });

            return encrypted;
        } finally {
            loading.value = false;
        }
    };

    /** Unlock a private key, transparently handling both protected and unprotected keys. */
    const unlockPrivateKey = async (privateKeyArmored: string, passphrase?: string) => {
        const privateKey = await openpgp.readPrivateKey({ armoredKey: privateKeyArmored });
        if (privateKey.isDecrypted()) return privateKey;
        if (!passphrase) throw new Error('This key is protected. A passphrase is required.');
        return openpgp.decryptKey({ privateKey, passphrase });
    };

    const decryptMessage = async (encryptedMessage: string, privateKeyArmored: string, passphrase?: string) => {
        loading.value = true;
        try {
            const privateKey = await unlockPrivateKey(privateKeyArmored, passphrase);
            const message = await openpgp.readMessage({ armoredMessage: encryptedMessage });
            const { data: decrypted } = await openpgp.decrypt({
                message,
                decryptionKeys: privateKey,
            });
            return decrypted as string;
        } finally {
            loading.value = false;
        }
    };

    const signMessage = async (message: string, privateKeyArmored: string, passphrase?: string) => {
        loading.value = true;
        try {
            const privateKey = await unlockPrivateKey(privateKeyArmored, passphrase);
            // Detached signature (-----BEGIN PGP SIGNATURE-----) so it round-trips
            // with the Verify tab, which supplies the original message separately.
            const signature = await openpgp.sign({
                message: await openpgp.createMessage({ text: message }),
                signingKeys: privateKey,
                format: 'armored',
                detached: true,
            });
            return signature;
        } finally {
            loading.value = false;
        }
    };

    const verifySignature = async (message: string, signatureArmored: string, publicKeyArmored: string) => {
        loading.value = true;
        try {
            const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
            const signature = await openpgp.readSignature({ armoredSignature: signatureArmored });
            const msg = await openpgp.createMessage({ text: message });

            const verificationResult = await openpgp.verify({
                message: msg,
                signature,
                verificationKeys: publicKey,
            });

            if (!verificationResult.signatures || verificationResult.signatures.length === 0) {
                return false;
            }

            try {
                await verificationResult.signatures[0].verified;
                return true;
            } catch (e) {
                console.error('Signature verification failed', e);
                return false;
            }
        } finally {
            loading.value = false;
        }
    };

    const importKey = async (armoredKey: string) => {
        try {
            const key = await openpgp.readKey({ armoredKey });
            const fingerprint = key.getFingerprint();
            const keyId = key.getKeyID().toHex();

            if (keys.value.some(k => k.id === keyId)) {
                throw new Error('Key already exists in keyring');
            }

            const user = key.getUserIDs()[0] || 'Unknown';
            const isPrivate = key.isPrivate();

            let name = 'Unknown';
            let email = '';
            // Linear-time parse of "Name <email>" (no catastrophic backtracking).
            const match = /^([^<]*)<([^>]*)>/.exec(user);
            if (match) {
                name = match[1].trim() || 'Unknown';
                email = match[2].trim();
            } else if (user) {
                name = user;
            }

            const privateKey = isPrivate ? armoredKey : '';
            const publicKey = isPrivate ? key.toPublic().armor() : armoredKey;

            const newKey: PgpKeyRecord = {
                id: keyId,
                fingerprint,
                name,
                email,
                privateKey,
                publicKey,
                revocationCertificate: '',
                createdAt: new Date().toISOString(),
                type: 'imported',
            };

            keys.value.push(newKey);
            saveKeys();
            return newKey;
        } catch (e: unknown) {
            const error = e as Error;
            console.error('Failed to import key', error);
            throw e;
        }
    };

    return {
        keys,
        loading,
        initKeys,
        generate,
        deleteKey,
        getKeyDetails,
        generateSubkey,
        encryptMessage,
        decryptMessage,
        signMessage,
        verifySignature,
        importKey,
    };
};
