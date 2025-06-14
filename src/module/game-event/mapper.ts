import { Sql } from "@src/db";
import { GameEventType } from "@src/model/external/dto/game-event-type";
import { GameEvent } from "@src/model/internal/game-event";
import { ExtraTimeGameEvent } from "@src/model/internal/game-event-extra-time";
import { GoalGameEvent } from "@src/model/internal/game-event-goal";
import { InjuryTimeGameEvent } from "@src/model/internal/game-event-injury-time";
import { PenaltyMissedGameEvent } from "@src/model/internal/game-event-penalty-missed";
import { PenaltyShootOutGameEvent } from "@src/model/internal/game-event-pso";
import { RedCardGameEvent } from "@src/model/internal/game-event-red-card";
import { SubstitutionGameEvent } from "@src/model/internal/game-event-substitution";
import { VarDecisionGameEvent } from "@src/model/internal/game-event-var-decision";
import { YellowCardGameEvent } from "@src/model/internal/game-event-yellow-card";
import { YellowRedCardGameEvent } from "@src/model/internal/game-event-yellow-red-card";
import { GameMinute } from "@src/model/internal/game-minute";
import { GameEventDaoInterface } from "@src/model/internal/interface/game-event.interface";
import { BookableOffence } from "@src/model/type/bookable-offence";
import { ExpulsionReason } from "@src/model/type/expulsion-reason";
import { GoalType } from "@src/model/type/goal-type";
import { PenaltyMissedReason } from "@src/model/type/penalty-missed-reason";
import { PsoResult } from "@src/model/type/pso-result";

export class GameEventMapper {

    constructor(private readonly sql: Sql) {}

    async getOrderedEventsForGame(gameId: number): Promise<GameEvent[]> {
        const result = await this.sql<GameEventDaoInterface[]>`select * from game_events where game_id = ${ gameId } order by sort_order asc`;
        if (result.length === 0) {
            return [];
        }

        return result.map(item => this.convertToEntity(item));
    }

    async getOrderedEventsForGamesMap(gameIds: number[]): Promise<Map<number, GameEvent[]>> {
        const result = await this.sql<GameEventDaoInterface[]>`select * from game_events where game_id in ${ this.sql(gameIds) } order by game_id, sort_order asc`;
        if (result.length === 0) {
            return new Map();
        }

        const resultMap = new Map<number, GameEvent[]>();
        for (const resultItem of result) {
            const eventEntity = this.convertToEntity(resultItem);

            const gameId = resultItem.gameId;
            const gameEntry = resultMap.get(gameId);
            if (gameEntry === undefined) {
                resultMap.set(gameId, [eventEntity]);
            } else {
                gameEntry.push(eventEntity);
            }
        }

        return resultMap;
    }

    private convertToEntity(item: GameEventDaoInterface): GameEvent {
        switch (item.type as GameEventType) {
            case GameEventType.Goal:
                return this.convertGoalEvent(item);
            case GameEventType.Substitution:
                return this.convertSubstitutionEvent(item);
            case GameEventType.YellowCard:
                return this.convertYellowCardEvent(item);
            case GameEventType.YellowRedCard:
                return this.convertYellowRedCardEvent(item);
            case GameEventType.RedCard:
                return this.convertRedCardEvent(item);
            case GameEventType.InjuryTime:
                return this.convertInjuryTimeEvent(item);
            case GameEventType.VarDecision:
                return this.convertVarDecisionEvent(item);
            case GameEventType.PenaltyShootOut:
                return this.convertPenaltyShootOut(item);
            case GameEventType.PenaltyMissed:
                return this.convertPenaltyMissed(item);
            case GameEventType.ExtraTime:
                return this.convertExtraTime(item);
            default:
                throw new Error(`Unhandled game event type ${item.type}`);
        }
    }

    private convertBaseEvent(item: GameEventDaoInterface): GameEvent {
        return {
            id: item.id,
            eventType: item.type as GameEventType,
            sortOrder: item.sortOrder,
            minute: new GameMinute(item.minute),
        };
    }

    private convertGoalEvent(item: GameEventDaoInterface): GoalGameEvent {
        return {
            ...this.convertBaseEvent(item),
            scoredBy: item.scoredBy as number,
            scoreMain: item.scoreMain as number,
            scoreOpponent: item.scoreOpponent as number,
            goalType: item.goalType as GoalType,
            assistBy: item.assistBy,
            penalty: item.penalty as boolean,
            ownGoal: item.ownGoal as boolean,
            directFreeKick: item.directFreeKick as boolean,
            bicycleKick: item.bicycleKick as boolean,
        }
    }

    private convertSubstitutionEvent(item: GameEventDaoInterface): SubstitutionGameEvent {
        return {
            ...this.convertBaseEvent(item),
            playerOff: item.playerOff as number,
            playerOn: item.playerOn as number,
            injured: item.injured,
        }
    }

    private convertYellowCardEvent(item: GameEventDaoInterface): YellowCardGameEvent {
        return {
            ...this.convertBaseEvent(item),
            affectedPlayer: item.affectedPlayer,
            affectedManager: item.affectedManager,
            reason: item.reason as BookableOffence,
            notOnPitch: item.notOnPitch,
        }
    }

    private convertYellowRedCardEvent(item: GameEventDaoInterface): YellowRedCardGameEvent {
        return {
            ...this.convertBaseEvent(item),
            affectedPlayer: item.affectedPlayer,
            affectedManager: item.affectedManager,
            reason: item.reason as BookableOffence,
            notOnPitch: item.notOnPitch,
        }
    }

    private convertRedCardEvent(item: GameEventDaoInterface): RedCardGameEvent {
        return {
            ...this.convertBaseEvent(item),
            affectedPlayer: item.affectedPlayer,
            affectedManager: item.affectedManager,
            reason: item.reason as ExpulsionReason,
            notOnPitch: item.notOnPitch,
        }
    }

    private convertInjuryTimeEvent(item: GameEventDaoInterface): InjuryTimeGameEvent {
        return {
            ...this.convertBaseEvent(item),
            additionalMinutes: item.additionalMinutes as number,
        }
    }

    private convertVarDecisionEvent(item: GameEventDaoInterface): VarDecisionGameEvent {
        return {
            ...this.convertBaseEvent(item),
            decision: item.decision as string,
            reason: item.reason as string,
            affectedPlayer: item.affectedPlayer as number,
        }
    }

    private convertPenaltyShootOut(item: GameEventDaoInterface): PenaltyShootOutGameEvent {
        return {
            ...this.convertBaseEvent(item),
            result: item.decision as PsoResult,
            takenBy: item.takenBy as number,
            scoreMain: item.scoreMain as number,
            scoreOpponent: item.scoreOpponent as number,
        }
    }

    private convertPenaltyMissed(item: GameEventDaoInterface): PenaltyMissedGameEvent {
        return {
            ...this.convertBaseEvent(item),
            takenBy: item.takenBy as number,
            goalkeeper: item.goalkeeper as number,
            reason: item.reason as PenaltyMissedReason,
        }
    }

    private convertExtraTime(item: GameEventDaoInterface): ExtraTimeGameEvent {
        return {
            ...this.convertBaseEvent(item),
        }
    }

}