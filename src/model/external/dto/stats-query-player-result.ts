import { BasicPersonDto } from "./basic-person";

export interface StatsQueryPlayerResult {
    player: BasicPersonDto;
    noOfGames: number;
    noOfGoals: number;
    noOfAssists: number;
}