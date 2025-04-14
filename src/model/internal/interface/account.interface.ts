export interface AccountDaoInterface {
    id: number;
    publicId: string;
    hashedEmail: string;
    displayName: string;
    enabled: boolean;
    createdAt: Date;
}