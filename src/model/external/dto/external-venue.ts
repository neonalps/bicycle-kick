import { ExternalProvider } from "@src/model/type/external-provider";

export interface ExternalVenueDto {
    provider: ExternalProvider;
    id: string;
    name: string;
    shortName: string;
    city: string;
    district?: string;
    countryCode: string;
    capacity: number;
    latitude?: number;
    longitude?: number;
}