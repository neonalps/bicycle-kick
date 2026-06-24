import { Sql } from "@src/db";
import { PersonContractDaoInterface } from "@src/model/internal/interface/person-contract.interface";
import { PersonContract } from "@src/model/internal/person-contract";
import { isDefined } from "@src/util/common";
import { PersonId } from "@src/util/domain-types";
import { Nullish } from "@src/util/types";

export class PersonContractMapper {

    constructor(private readonly sql: Sql) {}

    async getCurrentForPerson(personId: PersonId): Promise<Nullish<PersonContract>> {
        const result = await this.sql<PersonContractDaoInterface[]>`select * from person_contracts where person_id = ${ personId }`;
        if (result.length === 0) {
            return null;
        }

        return this.convertToEntity(result[0]);
    }

    private convertToEntity(item: PersonContractDaoInterface): PersonContract {
        return {
            id: item.id,
            personId: item.personId,
            contractUntil: isDefined(item.contractUntil) ? new Date(item.contractUntil) : null,
            onLoanUntil: isDefined(item.onLoanUntil) ? new Date(item.onLoanUntil) : null,
        };
    }

}