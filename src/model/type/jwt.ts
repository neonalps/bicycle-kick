export type Jwt = {
    type: string;
    iss: string;
    aud: string;
    sub: string;
    scp: string[];
    iat: number;
    exp: number;
    nbf: number;
}