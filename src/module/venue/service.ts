import { Venue } from "@src/model/internal/venue";

export class VenueService {

    searchByName(parts: string[]): Promise<Venue[]> {
        return new Promise((resolve) => {
            setTimeout(() => resolve([
                { id: 50, name: "Merkur Arena", shortName: "Merkur Arena", city: "Graz", district: "Liebenau", countryCode: "at", capacity: 16300 },
            ]), 89);
        });
    }

}