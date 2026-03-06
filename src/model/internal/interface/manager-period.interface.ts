import { DateString, ManagerPeriodId, PersonId } from "@src/util/domain-types";

export interface ManagerPeriodDaoInterface {
    id: ManagerPeriodId;
    personId: PersonId;
    start: DateString;
    end: DateString | null;
    interim: boolean;
}