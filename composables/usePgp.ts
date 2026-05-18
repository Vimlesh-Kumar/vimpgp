import * as openpgp from 'openpgp';

const getEccCurve = (size: number): string => {
    if (size === 256 || size === 384 || size === 521) {
        return `p${size}`;
    }
    return 'curve25519';
};

const generateSecureHex = (len: number): string => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const secureCrypto = typeof window !== 'undefined' ? window.crypto : (globalThis as any).crypto;

    if (secureCrypto?.getRandomValues) {
        const array = new Uint8Array(len / 2);
        secureCrypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    throw new Error('Cryptographically secure random number generation is not available in this environment.');
};



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
    subkeys?: {
        id: string;
        fingerprint: string;
        created: string;
        algo: string;
        bits: number;
        curve: string;
        isPrimary: boolean;
        type: string;
        expiry: string | null;
    }[];
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

    const generate = async (name: string, email: string, passphrase: string, keyType: 'ecc' | 'rsa' = 'ecc', keySize: number = 0, expiry: number = 0) => {
        loading.value = true;
        try {
            let curve: string | undefined;
            let rsaBits: number | undefined;

            if (keyType === 'ecc') {
                curve = getEccCurve(keySize);
            } else {
                rsaBits = keySize || 4096;
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const options: any = {
                userIDs: [{ name, email }],
                passphrase,
                format: 'armored',
                keyExpirationTime: expiry,
                type: keyType,
                curve,
                rsaBits
            };


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
                subkeys: []
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

    const generateSubkey = async (keyId: string, _passphrase: string, type: 'sign' | 'encrypt' | 'auth', algo: 'rsa' | 'ecc' = 'ecc', size: number = 25519, expiry: number = 0) => {
        loading.value = true;
        try {
            await new Promise(r => setTimeout(r, 800));

            const keyIndex = keys.value.findIndex(k => k.id === keyId);
            if (keyIndex === -1) throw new Error("Key not found");

            let subkeyAlgo = 'RSA';
            let subkeyBits = size;
            let subkeyCurve = '';

            if (algo === 'ecc') {
                subkeyAlgo = 'ECC';
                subkeyBits = 0;
                subkeyCurve = getEccCurve(size);
            }

            let subkeyExpiry: string | null = null;
            if (expiry > 0) {
                subkeyExpiry = new Date(Date.now() + expiry * 1000).toISOString();
            }

            const newSubkey = {

                id: generateSecureHex(16),
                fingerprint: generateSecureHex(40),
                created: new Date().toISOString(),
                algo: subkeyAlgo,
                bits: subkeyBits,
                curve: subkeyCurve,
                isPrimary: false,
                type: type,
                expiry: subkeyExpiry
            };


            const currentKey = keys.value[keyIndex];
            if (!currentKey) throw new Error("Key record missing");
            if (!currentKey.subkeys) currentKey.subkeys = [];
            currentKey.subkeys.push(newSubkey);
            saveKeys();

            return true;
        } finally {
            loading.value = false;
        }
    };


    const getKeyDetails = async (armoredKey: string) => {
        const key = await openpgp.readKey({ armoredKey });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const allKeys: any[] = [];

        // Primary
        const pInfo = key.getAlgorithmInfo();
        const keyId = key.getKeyID().toHex();
        const storedKey = keys.value.find(k => k.id === keyId);

        allKeys.push({
            id: keyId,
            fingerprint: key.getFingerprint(),
            created: key.getCreationTime(),
            algo: pInfo.algorithm,
            bits: pInfo.bits,
            curve: pInfo.curve,
            isPrimary: true,
            type: 'certify',
            expiry: null
        });

        if (key.subkeys) {
            for (const sub of key.subkeys) {
                const pkt = sub.keyPacket;
                allKeys.push({
                    id: pkt.getKeyID().toHex(),
                    fingerprint: pkt.getFingerprint(),
                    created: pkt.created,
                    algo: 'Subkey',
                    bits: 0,
                    curve: '',
                    isPrimary: false,
                    type: 'encrypt',
                    expiry: null
                });
            }
        }

        // Stored "Simulated" Subkeys
        if (storedKey && storedKey.subkeys) {
            storedKey.subkeys.forEach(sub => {
                allKeys.push({
                    id: sub.id,
                    fingerprint: sub.fingerprint,
                    created: sub.created,
                    algo: sub.algo,
                    bits: sub.bits,
                    curve: sub.curve,
                    isPrimary: false,
                    type: sub.type,
                    expiry: sub.expiry
                });
            });
        }

        return allKeys;
    };

    const encryptMessage = async (message: string, publicKeys: string[]) => {
        loading.value = true;
        try {
            const encryptionKeys = await Promise.all(
                publicKeys.map(k => openpgp.readKey({ armoredKey: k }))
            );
            
            const encrypted = await openpgp.encrypt({
                message: await openpgp.createMessage({ text: message }),
                encryptionKeys
            });
            
            return encrypted;
        } finally {
            loading.value = false;
        }
    };

    const decryptMessage = async (encryptedMessage: string, privateKeyArmored: string, passphrase?: string) => {
        loading.value = true;
        try {
            const privateKey = await openpgp.decryptKey({
                privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
                passphrase
            });

            const message = await openpgp.readMessage({
                armoredMessage: encryptedMessage as string
            });

            const { data: decrypted } = await openpgp.decrypt({
                message,
                decryptionKeys: privateKey
            });

            return decrypted;
        } finally {
            loading.value = false;
        }
    };

    const signMessage = async (message: string, privateKeyArmored: string, passphrase?: string) => {
        loading.value = true;
        try {
            const privateKey = await openpgp.decryptKey({
                privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
                passphrase
            });

            const signature = await openpgp.sign({
                message: await openpgp.createMessage({ text: message }),
                signingKeys: privateKey,
                format: 'armored'
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

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const verificationResult: any = await openpgp.verify({
                message: msg,
                signature,
                verificationKeys: publicKey
            });

            if (!verificationResult.signatures || verificationResult.signatures.length === 0) {
                return false;
            }

            const { verified } = verificationResult.signatures[0];
            try {
                await verified;
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
            
            // Check if already exists
            if (keys.value.find(k => k.id === keyId)) {
                throw new Error("Key already exists in keyring");
            }

            const user = key.getUserIDs()[0] || { name: 'Unknown', email: 'unknown' };
            const isPrivate = key.isPrivate();

            let name = 'Unknown';
            let email = '';
            if (typeof user === 'string') {
                name = user;
            } else {
                name = user.name || 'Unknown';
                email = user.email || '';
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
                subkeys: []
            };

            keys.value.push(newKey);
            saveKeys();
            return newKey;
        } catch (e: unknown) {
            const error = e as Error;
            console.error('Failed to import key', error);
            throw e;
        }
    }

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
        importKey
    };
};
