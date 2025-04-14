export interface AuthResponseDto {
    identity: {
        displayName: string | null;
        email: string;
        publicId: string;
    }
    token: {
        accessToken: string;
        refreshToken: string;
    }
}