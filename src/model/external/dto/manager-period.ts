import { DateString, ManagerPeriodId } from "@src/util/domain-types";
import { BasicPersonDto } from "./basic-person";

export interface ManagerPeriodDto {
    id: ManagerPeriodId;
    person: BasicPersonDto;
    start: DateString;
    end?: DateString;
    interim?: boolean;
}