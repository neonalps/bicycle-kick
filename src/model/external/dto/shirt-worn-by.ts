import { DateString } from "@src/util/domain-types";
import { BasicPersonDto } from "./basic-person";

export interface ShirtWornByDto {
    person: BasicPersonDto;
    firstWorn: DateString;
    lastWorn: DateString;
    wornCount: number;
}