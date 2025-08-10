type VerificationInfo = {
    code: string;
    expiresAt: number;
};

const verificationStore = new Map<string, VerificationInfo>();

export const generateCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6자리 숫자
};

export const saveCodeToStore = (email: string, code: string) => {
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5분 뒤 만료
    verificationStore.set(email, { code, expiresAt });
};

export const checkCodeFromStore = (
    email: string,
    inputCode: string
): 'valid' | 'expired' | 'invalid' => {
    const record = verificationStore.get(email);
    if (!record) return 'invalid';

    const { code, expiresAt } = record;

    if (Date.now() > expiresAt) {
        verificationStore.delete(email);
        return 'expired';
    }

    if (code !== inputCode) return 'invalid';

    return 'valid';
};
