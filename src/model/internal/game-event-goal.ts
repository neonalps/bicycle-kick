import { GameEvent } from "./game-event";
import { Person } from "./person";

export interface GoalGameEvent extends GameEvent {
    scorer: Person;
    assistBy?: Person;
    penalty: boolean;
    directFreeKick: boolean;
    bicylceKick: boolean;
    ownGoal: boolean;
    scoreMain: number;
    scoreOpponent: number;
    forMain: boolean;
}