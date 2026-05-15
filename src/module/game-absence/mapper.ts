import { Sql } from "@src/db";
import { CreateGameAbsence } from "@src/model/internal/create-game-absence";
import { GameAbsence } from "@src/model/internal/game-absence";
import { GameAbsenceDaoInterface } from "@src/model/internal/interface/game-absence.interface";
import { CompetitionId, GameAbsenceId, GameId, PersonId, SeasonId } from "@src/util/domain-types";
import { GameAbsenceType } from "@src/model/type/game-absence";
import { OmitStrict } from "@src/util/types";
import { StoreGameAbsenceDto } from "@src/model/external/dto/store-game-absence";

export class GameAbsenceMapper {

    constructor(private readonly sql: Sql) {}

    async getForGame(gameId: GameId): Promise<GameAbsence[]> {
        const result = await this.sql<GameAbsenceDaoInterface[]>`select * from game_absences where game_id = ${ gameId } order by sort_order`;
        if (result.length === 0) {
            return [];
        }

        return result.map(item => this.convertToEntity(item));
    }

    async getOrderedAbsencesForGamesMap(gameIds: GameId[]): Promise<Map<GameId, GameAbsence[]>> {
        const result = await this.sql<GameAbsenceDaoInterface[]>`select * from game_absences where game_id in ${ this.sql(gameIds) } order by game_id, sort_order asc`;
        if (result.length === 0) {
            return new Map();
        }

        const resultMap = new Map<GameId, GameAbsence[]>();
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

    async findYellowCardSuspensionsForCompetition(potentiallySuspendedPersons: PersonId[], relevantCompetitionIds: CompetitionId[], seasonId: SeasonId): Promise<GameAbsence[]> {
        const result = await this.sql<GameAbsenceDaoInterface[]>`
            select
                ga.*
            from
                game_absences ga left join
                game g on ga.game_id = g.id
            where
                ga.person_id in ${ this.sql(potentiallySuspendedPersons) } and
                ga.absence_type = ${ GameAbsenceType.Suspended } and
                ga.absence_reason like 'yellowCard:%' and
                g.season_id = ${ seasonId } and
                g.competition_id in ${ this.sql(relevantCompetitionIds) }
        `;

        if (result.length === 0) {
            return [];
        }

        return result.map(item => this.convertToEntity(item));
    }

    async putForGame(gameId: GameId, absences: StoreGameAbsenceDto[]): Promise<void> {
        await this.sql.begin(async tx => {
            // delete all existing absences for this game
            await tx`delete from game_absences where game_id = ${gameId}`;
            
            const insertAbsences: Array<OmitStrict<GameAbsence, 'id'>> = absences.map((item, idx) => {
                return {
                    gameId: gameId,
                    personId: item.personId,
                    sortOrder: idx,
                    absenceType: item.absenceType as GameAbsenceType,
                    absenceReason: item.absenceReason,
                }
            });
            
            await tx`insert into game_absences ${ tx(insertAbsences, 'gameId', 'personId', 'sortOrder', 'absenceReason', 'absenceType') }`;
        });
    }

    private convertToEntity(item: GameAbsenceDaoInterface): GameAbsence {
        return {
            id: item.id,
            gameId: item.gameId,
            personId: item.personId,
            sortOrder: item.sortOrder,
            absenceReason: item.absenceReason,
            absenceType: item.absenceType,
        }
    }

}