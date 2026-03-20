import { DateString } from "@src/util/domain-types";

export interface AccountDaoInterface {
    id: number;
    publicId: string;
    email: string;
    enabled: boolean;
    createdAt: DateString;
    roles: string;
    firstName?: string;
    lastName?: string;
    hasProfilePicture: boolean;
    language: string;
    dateFormat: string;
    scoreFormat: string;
    gameMinuteFormat: string;
    latestLogin?: DateString;
}