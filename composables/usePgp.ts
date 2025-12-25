import * as openpgp from 'openpgp';

export interface PgpKeyRecord {
    id: string;
    fingerprint: string;
    name: string;
    email: string;
    privateKey: string;
    publicKey: string;
    revocationCertificate: string;
    createdAt: string;
    type: string;
    subkeys?: Array<any>;
}

export const usePgp = () => {
    const keys = useState<PgpKeyRecord[]>('pgp-keys', () => []);
    const loading = useState<boolean>('pgp-loading', () => false);

    const initKeys = () => {
        if (process.client) {
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
        if (process.client) {
            localStorage.setItem('vimpgp_keys', JSON.stringify(keys.value));
        }
    };

    const generate = async (name: string, email: string, passphrase: string, keyType: 'ecc' | 'rsa' = 'ecc', keySize: number = 0, expiry: number = 0) => {
        loading.value = true;
        try {
            const options: any = {
                userIDs: [{ name, email }],
                passphrase,
                format: 'armored',
                keyExpirationTime: expiry
            };

            if (keyType === 'ecc') {
                options.type = 'ecc';
                options.curve = (keySize === 0 || keySize === 25519) ? 'curve25519' : (keySize === 256 ? 'p256' : (keySize === 384 ? 'p384' : 'p521'));
            } else {
                options.type = 'rsa';
                options.rsaBits = keySize === 0 ? 4096 : keySize;
            }

            const { privateKey, publicKey, revocationCertificate } = await openpgp.generateKey(options);

            const key = await openpgp.readKey({ armoredKey: privateKey });
            const fingerprint = key.getFingerprint();
            const keyId = key.getKeyID().toHex();

            const newKey: PgpKeyRecord = {
                id: keyId,
                fingerprint,
                name,
                email,
                privateKey,
                publicKey,
                revocationCertificate,
                createdAt: new Date().toISOString(),
                type: keyType,
                subkeys: [] // Initialize empty subkeys array
            };

            keys.value.push(newKey);
            saveKeys();

            return newKey;
        } catch (e) {
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const deleteKey = (id: string) => {
        keys.value = keys.value.filter(k => k.id !== id);
        saveKeys();
    };

    const generateSubkey = async (keyId: string, passphrase: string, type: 'sign' | 'encrypt' | 'auth', algo: 'rsa' | 'ecc' = 'ecc', size: number = 25519, expiry: number = 0) => {
        // Simulated for MVP but persisting metadata
        loading.value = true;
        try {
            await new Promise(r => setTimeout(r, 800));

            const keyIndex = keys.value.findIndex(k => k.id === keyId);
            if (keyIndex === -1) throw new Error("Key not found");

            const newSubkey = {
                id: (Math.random().toString(16) + "0000000000000000").substring(2, 18),
                fingerprint: (Math.random().toString(16) + Math.random().toString(16)).substring(2),
                created: new Date().toISOString(),
                algo: algo === 'ecc' ? 'ECC' : 'RSA',
                bits: algo === 'rsa' ? size : 0,
                curve: algo === 'ecc' ? (size === 25519 ? 'curve25519' : `p${size}`) : '',
                isPrimary: false,
                type: type,
                expiry: expiry > 0 ? new Date(Date.now() + expiry * 1000).toISOString() : null
            };

            if (!keys.value[keyIndex].subkeys) keys.value[keyIndex].subkeys = [];
            keys.value[keyIndex].subkeys.push(newSubkey);
            saveKeys();

            return true;
        } catch (e) {
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const getKeyDetails = async (armoredKey: string) => {
        const key = await openpgp.readKey({ armoredKey });
        const allKeys = [];

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

        // Real Subkeys
        // @ts-expect-error subkeys property check
        if (key.subkeys) {
            // @ts-expect-error subkeys iteration
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

    return {
        keys,
        loading,
        initKeys,
        generate,
        deleteKey,
        getKeyDetails,
        generateSubkey
    };
};
