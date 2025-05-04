import { GameEventType } from "../dto/game-event-type";
import { PrimitiveType, StringEnumType } from "./types";

export const gameEventTypeValidation: StringEnumType = {
    type: 'string',
    enum: [
        GameEventType.Goal, 
        GameEventType.Substitution, 
        GameEventType.YellowCard,
        GameEventType.YellowRedCard,
        GameEventType.RedCard,
        GameEventType.InjuryTime,
        GameEventType.PenaltyMissed,
        GameEventType.VarDecision,
        GameEventType.ExtraTime,
        GameEventType.PenaltyShootOut,
    ],
} as const;