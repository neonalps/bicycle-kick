import { Competition } from "@src/model/internal/competition";

export class CompetitionService {

    searchByName(parts: string[]): Promise<Competition[]> {
        const returnValue = parts.indexOf("cup") >= 0 ? this.getCup() : this.getLeague();

        return new Promise((resolve) => {
            setTimeout(() => resolve([
               returnValue,
            ]), 112);
        });
    }

    private getCup(): Competition {
        return { id: 4, name: "Österreichischer Cup", shortName: "Cup", };
    }

    private getLeague(): Competition {
        return { id: 3, name: "Österreichische Bundesliga", shortName: "Bundesliga", };
    }

}