import { Club } from "@src/model/internal/club";

export class ClubService {

    searchByName(parts: string[]): Promise<Club[]> {
        const returnValue = parts.indexOf("rapid") >= 0 ? this.getRapid() : this.getSalzburg();

        return new Promise((resolve) => {
            setTimeout(() => resolve([
                returnValue,
            ]), 89);
        });
    }

    private getRapid(): Club {
        return { id: 70, name: "SK Rapid Wien", shortName: "Rapid", };
    }

    private getSalzburg(): Club {
        return { id: 71, name: "FC Red Bull Salzburg", shortName: "Salzburg", };
    }

}