import { ManagerPeriodId, PersonId } from "@src/util/domain-types";

export interface ManagerPeriod {
    id: ManagerPeriodId;
    personId: PersonId;
    start: Date;
    end: Date | null;
    interim: boolean;
}