import { Sql } from "@src/db";
import { SeasonTitleDaoInterface } from "@src/model/internal/interface/season-title.interface";
import { SeasonTitle } from "@src/model/internal/season-title";
import { isDefined } from "@src/util/common";

export class SeasonTitlesMapper {

    constructor(private readonly sql: Sql) {}

    async getTitlesForPeriod(from: Date, to: Date | null): Promise<SeasonTitle[]> {
        const result = await this.sql<SeasonTitleDaoInterface[]>`
            select
                st.id,
                st.season_id,
                st.competition_id,
                st.victory_date,
                st.victory_game,
                st.title_count,
                coalesce(st.victory_date, g.kickoff) as effective_victory_date
            from
                season_titles st left join
                game g on st.victory_game = g.id
            where
                coalesce(st.victory_date, g.kickoff) >= ${ from }
                ${isDefined(to) ? this.sql` and coalesce(st.victory_date, g.kickoff) <= ${ to }` : this.sql``}
            order by
                effective_victory_date asc nulls last
        `;

        if (result.length === 0) {
            return [];
        }

        return result.map(item => this.convertToEntity(item));
    }

    private convertToEntity(item: SeasonTitleDaoInterface): SeasonTitle {
        return {
            id: item.id,
            seasonId: item.seasonId,
            competitionId: item.competitionId,
            victoryDate: isDefined(item.victoryDate) ? new Date(item.victoryDate) : undefined,
            victoryGame: item.victoryGame,
            titleCount: item.titleCount,
        };
    }

}