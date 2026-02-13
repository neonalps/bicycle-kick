import { PersonId } from "@src/util/domain-types";

export interface MergePersonsRequestDto {
    personIds: PersonId[];
}