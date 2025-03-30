export interface GameDaoInterface {
    id: number;
    kickoff: Date;
    resultTendency: string;
    opponentId: number;
    competitionId: number;
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