import { IdentityDto } from "./identity";

export interface AuthResponseDto {
    identity: IdentityDto;
    token: {
        accessToken: string;
        refreshToken: string;
    }
}