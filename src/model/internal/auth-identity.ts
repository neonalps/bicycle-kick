export interface AuthIdentity {
    publicId: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    firstName?: string;
    lastName?: string;
}