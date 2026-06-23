import { DateString, PersonContractId } from "@src/util/domain-types";
import { BasicPersonDto } from "./basic-person";
import { OmitStrict } from "@src/util/types";

export interface PersonContractDto {
    id: PersonContractId;
    person: BasicPersonDto;
    contractUntil?: DateString;
    onLoanUntil?: DateString;
}

export type ContractForPersonDto = OmitStrict<PersonContractDto, 'person'>;