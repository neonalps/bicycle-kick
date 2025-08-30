import { DashboardWidget } from "@src/module/dashboard/service";

export interface DashboardRequestDto {
    widgets?: DashboardWidget[];
    competition?: string;
}