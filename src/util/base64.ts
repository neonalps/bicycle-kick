export class Base64Utils {

    decode(toDecode: string): string {
        return Buffer.from(toDecode, 'base64').toString('utf8');
    }

    encode(toEncode: string): string {
        return Buffer.from(toEncode).toString('base64');
    }

}