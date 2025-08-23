import { Base64Utils } from "./base64";

const base64Utils = new Base64Utils();

export function parseJwt(token: string): Record<string, unknown> {
    const tokenParts = token.split(".");
    if (tokenParts.length !== 3) {
        throw new Error(`Invalid token passed`);
    }

    return JSON.parse(base64Utils.decode(tokenParts[1]));
}