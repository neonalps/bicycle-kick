import { Sql } from "@src/db";
import { GameEventType } from "@src/model/external/dto/game-event-type";
import { GameEvent } from "@src/model/internal/game-event";
import { GoalGameEvent } from "@src/model/internal/game-event-goal";
import { SubstitutionGameEvent } from "@src/model/internal/game-event-substitution";
import { GameMinute } from "@src/model/internal/game-minute";
import { GameEventDaoInterface } from "@src/model/internal/interface/game-event.interface";
import { GoalType } from "@src/model/type/goal-type";

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
        switch (item.eventType as GameEventType) {
            case GameEventType.Goal:
                return this.convertGoalEvent(item);
            case GameEventType.Substitution:
                return this.convertSubstitutionEvent(item);
            default:
                throw new Error(`Unhandled game event type ${item.eventType}`);
        }
    }

    private convertBaseEvent(item: GameEventDaoInterface): GameEvent {
        return {
            id: item.id,
            eventType: item.eventType as GameEventType,
            sortOrder: item.sortOrder,
            minute: new GameMinute(item.minute),
        };
    }

    private convertGoalEvent(item: GameEventDaoInterface): GoalGameEvent {
        return {
            ...this.convertBaseEvent(item),
            scoredBy: item.scoredBy,
            scoreMain: item.scoreMain,
            scoreOpponent: item.scoreOpponent,
            goalType: item.goalType as GoalType,
            assistBy: item.assistBy,
            penalty: item.penalty,
            ownGoal: item.ownGoal,
            directFreeKick: item.directFreeKick,
            bicycleKick: item.bicycleKick,
        }
    }

    private convertSubstitutionEvent(item: GameEventDaoInterface): SubstitutionGameEvent {
        return {
            ...this.convertBaseEvent(item),
            playerOff: item.playerOff,
            playerOn: item.playerOn,
            injured: item.injured,
        }
    }

}