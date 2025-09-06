import { IdentityDto } from "./identity";
import { ProfileSettingsDto } from "./profile-settings";
import { TokenResponseDto } from "./token-response";

export interface AuthResponseDto {
    identity: IdentityDto;
    token: TokenResponseDto;
    profileSettings: ProfileSettingsDto;
}