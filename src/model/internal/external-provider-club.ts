import { ExternalProvider } from "@src/model/type/external-provider";
import { ClubId } from "@src/util/domain-types";

export interface ExternalProviderClub {
    id: number;
    externalProvider: ExternalProvider;
    externalId: string;
    clubId: ClubId;
}