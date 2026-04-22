import { DateString, ManagerPeriodId } from "@src/util/domain-types";
import { BasicPersonDto } from "./basic-person";
import { RecordSummaryDto } from "./record-summary";
import { SeasonTitleDto } from "./season-title";

export interface ManagerPeriodDto {
    id: ManagerPeriodId;
    person: BasicPersonDto;
    start: DateString;
    end?: DateString;
    interim?: boolean;
    summary: RecordSummaryDto;
    titles: SeasonTitleDto[];
}