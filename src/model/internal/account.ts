import { AccountRole } from "@src/model/type/account-role";

export interface Account {
    id: number;
    publicId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    roles: AccountRole;
    enabled: boolean;
    createdAt: Date;
}