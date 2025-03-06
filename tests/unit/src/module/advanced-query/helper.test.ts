import { describe, expect, it } from '@jest/globals'
import { QueryContext } from '@src/module/advanced-query/context';
import { convertContextToSql } from '@src/module/advanced-query/helper';

describe('Advanced query mapper', () => {
    describe('convertContextToSql', () => {
        type ConvertContextToSqlTest = {
            input: {
                description: string,
                context: QueryContext;
            },
            expected: string,
        };

        const lastHattrickContext: QueryContext = {
            select: ["g.id as 'game_id'", "p.id as 'person_id'"],
            from: ["game g", "game_players gp on gp.game_id = g.id", "person p on p.id = gp.player_id", "competition c on c.id = g.competition_id"],
            where: ["gp.plays_for_main = 1", "gp.goals_scored >= 3", "c.short_name ilike '%Bundesliga%' or c.short_name ilike '%Cup%'"],
            orderBy: ["g.kickoff desc"],
        };

        it.each<ConvertContextToSqlTest>([
            { input: { description: 'Last time a main player scored a hattrick in a competition', context: lastHattrickContext }, expected: "select g.id as 'game_id', p.id as 'person_id' from game g left join game_players gp on gp.game_id = g.id left join person p on p.id = gp.player_id left join competition c on c.id = g.competition_id where gp.plays_for_main = 1 and gp.goals_scored >= 3 and c.short_name ilike '%Bundesliga%' or c.short_name ilike '%Cup%' order by g.kickoff desc" },
        ])('$input.description', ({ input, expected }) => {
            const { context } = input;
            expect(convertContextToSql(context)).toStrictEqual(expected);
        });
    });
});