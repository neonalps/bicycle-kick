import { AccountRole } from "@src/model/type/account-role";

export interface AuthIdentity {
    publicId: string;
    email: string;
    role: AccountRole;
    accessToken: string;
    refreshToken: string;
    firstName?: string;
    lastName?: string;
}