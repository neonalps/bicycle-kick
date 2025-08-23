import { IdentityDto } from "./identity";
import { TokenResponseDto } from "./token-response";

export interface AuthResponseDto {
    identity: IdentityDto;
    token: TokenResponseDto;
}