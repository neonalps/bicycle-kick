import { PersonContractId, PersonId } from "@src/util/domain-types";
import { Nullish } from "@src/util/types";

export interface PersonContract {
    id: PersonContractId;
    personId: PersonId;
    contractUntil: Nullish<Date>;
    onLoanUntil: Nullish<Date>;
}