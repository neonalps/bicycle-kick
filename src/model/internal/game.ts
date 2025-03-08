import { Tendency } from "../type/tendency";
import { Club } from "./club";
import { Competition } from "./competition";

export interface Game {
    id: number;
    kickoff: Date;
    resultTendency: Tendency;
    opponent: Club;
    competition: Competition;
    round: string;
    attendance: number;
    isHomeTeam: boolean;
    isSoldOut: boolean;
    fullTimeGoalsMain: number;
    fullTimeGoalsOpponent: number;
    halfTimeGoalsMain: number;
    halfTimeGoalsOpponent: number;
    turnaroundsMain: number;
    turnaroundsOpponent: number;
}