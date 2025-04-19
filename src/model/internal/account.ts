import { AccountRole } from "@src/model/type/account-role";

export interface Account {
    id: number;
    publicId: string;
    displayName: string;
    hashedEmail: string;
    roles: AccountRole[];
    enabled: boolean;
    createdAt: Date;
}