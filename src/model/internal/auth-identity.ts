export interface AuthIdentity {
    displayName: string | null;
    email: string;
    publicId: string;
    accessToken: string;
    refreshToken: string;
}