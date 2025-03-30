import { Person } from "@src/model/internal/person";

export class PersonService {

    searchByName(parts: string[]): Promise<Person[]> {
        return new Promise((resolve) => {
            setTimeout(() => resolve([
               //{ id: 5, name: "Manprit Sarkaria", shortName: "Sarkaria", },
               //{ id: 8, name: "Alexander Prass", shortName: "Prass", },
               { id: 5, name: "William Bøving", shortName: "Bøving", },
            ]), 200);
        });
    }

}