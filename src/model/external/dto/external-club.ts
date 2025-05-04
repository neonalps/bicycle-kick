import { ExternalProvider } from "@src/model/type/external-provider";

export interface ExternalClubDto {
    provider: ExternalProvider;
    id: string;
    name: string;
    shortName: string;
    iconLarge?: string;
    iconSmall?: string;
    city: string;
    district?: string;
    countryCode: string;
    primaryColour?: string;
    secondaryColour?: string;
}