import crypto, { createHmac } from 'crypto';
import { validateNotBlank, validateNotNull } from '@src/util/validation';

export interface CryptoServiceConfig {
    encryptionAlgorithm: string;
    hmacAlgorithm: string;
    ivSize: number;
    cryptoKey: string;
}

export class CryptoService {

    private static readonly HEX = "hex";
    private static readonly JOIN_CHAR = ":";
    
    private readonly keyBuffer: Buffer;

    constructor(private readonly config: CryptoServiceConfig) {
        validateNotNull(this.config, "config");
        validateNotBlank(this.config.encryptionAlgorithm, "config.encryptionAlgorithm");
        validateNotBlank(this.config.hmacAlgorithm, "config.hmacAlgorithm");
        validateNotNull(this.config.ivSize, "config.ivSize");
        validateNotBlank(this.config.cryptoKey, "config.cryptoKey");

        this.keyBuffer = Buffer.from(this.config.cryptoKey, CryptoService.HEX);
    }

    public encrypt(plaintext: string): string {
        const iv = this.getIv();
        const cipher = crypto.createCipheriv(this.config.encryptionAlgorithm, this.keyBuffer, iv)
        const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
        return [iv.toString(CryptoService.HEX), encrypted.toString(CryptoService.HEX)].join(CryptoService.JOIN_CHAR);
    };
    
    public decrypt(ciphertext: string): string {
        const ciphertextParts = ciphertext.split(CryptoService.JOIN_CHAR);
        if (!ciphertextParts || ciphertextParts.length !== 2) {
            throw new Error("Invalid ciphertext provided");
        }
    
        const iv = Buffer.from(ciphertextParts[0], CryptoService.HEX);
        const encryptedText = Buffer.from(ciphertextParts[1], CryptoService.HEX);
        const decipher = crypto.createDecipheriv(this.config.encryptionAlgorithm, this.keyBuffer, iv);
        return Buffer.concat([decipher.update(encryptedText), decipher.final()]).toString();
    };
    
    public hash(input: string): string {
        return this.getHmac().update(input).digest(CryptoService.HEX);
    };

    private getIv(): Buffer {
        return crypto.randomBytes(this.config.ivSize);
    }

    private getHmac() {
        return createHmac(this.config.hmacAlgorithm, this.keyBuffer);
    }
    
}
