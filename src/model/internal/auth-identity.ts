import { AccountRole } from "@src/model/type/account-role";
import { ProfileSettings } from "./profile-settings";

export interface AuthIdentity {
    publicId: string;
    email: string;
    role: AccountRole;
    accessToken: string;
    refreshToken: string;
    profileSettings: ProfileSettings;
}