"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const helper_1 = require("@src/module/advanced-query/helper");
(0, globals_1.describe)('Advanced query mapper', () => {
    (0, globals_1.describe)('convertContextToSql', () => {
        const lastHattrickContext = {
            select: ["g.id as 'game_id'", "p.id as 'person_id'"],
            from: ["game g", "game_players gp on gp.game_id = g.id", "person p on p.id = gp.player_id", "competition c on c.id = g.competition_id"],
            where: ["gp.plays_for_main = 1", "gp.goals_scored >= 3", "c.short_name ilike '%Bundesliga%' or c.short_name ilike '%Cup%'"],
            orderBy: ["g.kickoff desc"],
        };
        globals_1.it.each([
            { input: { description: 'Last time a main player scored a hattrick in a competition', context: lastHattrickContext }, expected: "select g.id as 'game_id', p.id as 'person_id' from game g left join game_players gp on gp.game_id = g.id left join person p on p.id = gp.player_id left join competition c on c.id = g.competition_id where gp.plays_for_main = 1 and gp.goals_scored >= 3 and c.short_name ilike '%Bundesliga%' or c.short_name ilike '%Cup%' order by g.kickoff desc" },
        ])('$input.description', ({ input, expected }) => {
            const { context } = input;
            (0, globals_1.expect)((0, helper_1.convertContextToSql)(context)).toStrictEqual(expected);
        });
    });
});
