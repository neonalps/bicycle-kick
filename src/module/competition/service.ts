import { Competition } from "@src/model/internal/competition";

export class CompetitionService {

    searchByName(name: string): Promise<Competition[]> {
        return new Promise((resolve) => {
            setTimeout(() => resolve([
               { id: 3, name: "Österreichische Bundesliga", shortName: "Bundesliga", },
            ]), 112);
        });
    }

}