import { ShirtWornBySortMode } from "@src/module/stats/service";
import { Shirt } from "@src/util/domain-types";

export interface GetShirtStatsRequestDto {
    shirt: Shirt;
    sortMode?: ShirtWornBySortMode;
}