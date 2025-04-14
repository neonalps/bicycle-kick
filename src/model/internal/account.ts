export interface Account {
    id: number;
    publicId: string;
    displayName: string;
    hashedEmail: string;
    enabled: boolean;
    createdAt: Date;
}