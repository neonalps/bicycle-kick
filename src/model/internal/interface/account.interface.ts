export interface AccountDaoInterface {
    id: number;
    publicId: string;
    email: string;
    enabled: boolean;
    createdAt: Date;
    roles: string;
    firstName?: string;
    lastName?: string;
}