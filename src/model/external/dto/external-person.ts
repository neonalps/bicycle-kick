import { ExternalProvider } from "@src/model/type/external-provider";
import { DateString } from "@src/util/domain-types";

export interface ExternalPersonDto {
    provider: ExternalProvider;
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    birthday?: DateString;
}