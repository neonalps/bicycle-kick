import { PersonId } from "@src/util/domain-types";
import { PersonContractMapper } from "./mapper";
import { Nullish } from "@src/util/types";
import { PersonContract } from "@src/model/internal/person-contract";
import { validateNotNull } from "@src/util/validation";

export class PersonContractService {

    constructor(private readonly mapper: PersonContractMapper) {}

    async getCurrentForPerson(personId: PersonId): Promise<Nullish<PersonContract>> {
        validateNotNull(personId, "personId");

        return await this.mapper.getCurrentForPerson(personId);
    }

}