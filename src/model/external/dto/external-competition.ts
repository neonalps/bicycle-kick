import { ExternalProvider } from "@src/model/type/external-provider";

export interface ExternalCompetitionDto {
    provider: ExternalProvider;
    id: string;
    name: string;
    shortName: string;
}