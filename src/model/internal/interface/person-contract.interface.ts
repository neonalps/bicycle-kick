import { DateString, PersonContractId, PersonId } from "@src/util/domain-types";
import { Nullish } from "@src/util/types";

export interface PersonContractDaoInterface {
    id: PersonContractId;
    personId: PersonId;
    contractUntil: Nullish<DateString>;
    onLoanUntil: Nullish<DateString>;
}