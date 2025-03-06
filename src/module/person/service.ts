import { Person } from "@src/model/internal/person";

export class PersonService {

    searchByName(name: string): Promise<Person[]> {
        return new Promise((resolve) => {
            setTimeout(() => resolve([
               { id: 5, name: "Manprit Sarkaria", shortName: "Sarkaria", },
            ]), 200);
        });
    }

}