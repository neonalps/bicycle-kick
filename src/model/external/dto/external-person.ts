import { ExternalProvider } from "@src/model/type/external-provider";

export interface ExternalPersonDto {
    provider: ExternalProvider;
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    birthday?: Date;
}