import { ManagerPeriodId, PersonId } from "@src/util/domain-types";
import { RecordSummary } from "./game";
import { SeasonTitle } from "./season-title";

export interface ManagerPeriod {
    id: ManagerPeriodId;
    personId: PersonId;
    start: Date;
    end: Date | null;
    interim: boolean;
    summary: RecordSummary;
    titles?: SeasonTitle[];
}