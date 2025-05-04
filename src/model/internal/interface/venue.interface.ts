export interface VenueDaoInterface {
    id: number;
    name: string;
    shortName: string;
    city: string;
    countryCode: string;
    district?: string;
    capacity: number;
    latitude?: number;
    longitude?: number;
}