import { GameEventType } from "@src/model/external/dto/game-event-type";
import { GameEvent } from "./game-event";
import { Person } from "./person";

export interface GoalGameEvent extends GameEvent {
    id: number;
    eventType: GameEventType;
    sortOrder: number;
    minute: string;
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