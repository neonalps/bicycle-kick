import { ExternalProvider } from "@src/model/type/external-provider";

export interface ExternalProviderPerson {
    id: number;
    externalProvider: ExternalProvider;
    externalId: string;
    personId: number;
}