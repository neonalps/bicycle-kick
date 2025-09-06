import { ProfileSettingsDto } from "./profile-settings";

export interface AccountProfileDto {
    id: string;
    email: string;
    profileSettings: ProfileSettingsDto;
}