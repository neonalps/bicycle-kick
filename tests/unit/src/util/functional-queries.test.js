"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const game_minute_1 = require("@src/model/internal/game-minute");
const score_1 = require("@src/model/internal/score");
const functional_queries_1 = require("@src/util/functional-queries");
const HOME_2_1 = [
    {
        minute: "10",
        scoreMain: 1,
        scoreOpponent: 0,
    },
    {
        minute: "89",
        scoreMain: 2,
        scoreOpponent: 0,
    },
    {
        minute: "90+5",
        scoreMain: 2,
        scoreOpponent: 1,
    },
];
const HOME_3_2_TURNAROUND = [
    {
        minute: "11",
        scoreMain: 0,
        scoreOpponent: 1,
    },
    {
        minute: "15",
        scoreMain: 0,
        scoreOpponent: 2,
    },
    {
        minute: "61",
        scoreMain: 1,
        scoreOpponent: 2,
    },
    {
        minute: "84",
        scoreMain: 2,
        scoreOpponent: 2,
    },
    {
        minute: "90+2",
        scoreMain: 3,
        scoreOpponent: 2,
    },
];
const HOME_5_0 = [
    {
        minute: "29",
        scoreMain: 1,
        scoreOpponent: 0,
    },
    {
        minute: "40",
        scoreMain: 2,
        scoreOpponent: 0,
    },
    {
        minute: "55",
        scoreMain: 3,
        scoreOpponent: 0,
    },
    {
        minute: "88",
        scoreMain: 4,
        scoreOpponent: 2,
    },
    {
        minute: "90+4",
        scoreMain: 5,
        scoreOpponent: 0,
    },
];
(0, globals_1.describe)('Functional queries', () => {
    (0, globals_1.describe)('getScoreAfterMinute', () => {
        globals_1.it.each([
            { input: { description: 'no goals, full-time', goalEvents: [], minute: game_minute_1.GameMinute.FULL_TIME }, expected: new score_1.Score(0, 0) },
            { input: { description: '2:1, full-time', goalEvents: HOME_2_1, minute: game_minute_1.GameMinute.FULL_TIME, }, expected: new score_1.Score(2, 1) },
            { input: { description: '2:1, half-time', goalEvents: HOME_2_1, minute: game_minute_1.GameMinute.HALF_TIME, }, expected: new score_1.Score(1, 0) },
            { input: { description: '2:1, 9th minute', goalEvents: HOME_2_1, minute: new game_minute_1.GameMinute("9"), }, expected: new score_1.Score(0, 0) },
            { input: { description: '2:1, 10th minute', goalEvents: HOME_2_1, minute: new game_minute_1.GameMinute("10"), }, expected: new score_1.Score(1, 0) },
            { input: { description: '2:1, 90th minute', goalEvents: HOME_2_1, minute: new game_minute_1.GameMinute("90"), }, expected: new score_1.Score(2, 0) },
            { input: { description: '2:1, 90th minute +4', goalEvents: HOME_2_1, minute: new game_minute_1.GameMinute("90+4"), }, expected: new score_1.Score(2, 0) },
            { input: { description: '3:2, 60th minute', goalEvents: HOME_3_2_TURNAROUND, minute: new game_minute_1.GameMinute("60"), }, expected: new score_1.Score(0, 2) },
            { input: { description: '3:2, 61st minute', goalEvents: HOME_3_2_TURNAROUND, minute: new game_minute_1.GameMinute("61"), }, expected: new score_1.Score(1, 2) },
        ])('$input.description', ({ input, expected }) => {
            const { goalEvents: goals, minute } = input;
            (0, globals_1.expect)((0, functional_queries_1.getScoreAfterMinute)(goals, minute)).toStrictEqual(expected);
        });
    });
    (0, globals_1.describe)('isMinuteInPeriod', () => {
        globals_1.it.each([
            { input: { description: '1 (HT - FT): false', minute: new game_minute_1.GameMinute('1'), from: game_minute_1.GameMinute.HALF_TIME, to: game_minute_1.GameMinute.FULL_TIME }, expected: false },
            { input: { description: '45+1 (HT - FT): false', minute: new game_minute_1.GameMinute('45+1'), from: game_minute_1.GameMinute.HALF_TIME, to: game_minute_1.GameMinute.FULL_TIME }, expected: false },
            { input: { description: '46 (HT - FT): true', minute: new game_minute_1.GameMinute('46'), from: game_minute_1.GameMinute.HALF_TIME, to: game_minute_1.GameMinute.FULL_TIME }, expected: true },
            { input: { description: '90+1 (HT - FT): true', minute: new game_minute_1.GameMinute('90+1'), from: game_minute_1.GameMinute.HALF_TIME, to: game_minute_1.GameMinute.FULL_TIME }, expected: true },
            { input: { description: '90+10 (HT - FT): true', minute: new game_minute_1.GameMinute('90+10'), from: game_minute_1.GameMinute.HALF_TIME, to: game_minute_1.GameMinute.FULL_TIME }, expected: true },
            { input: { description: '91 (FT - 91): true', minute: new game_minute_1.GameMinute('91'), from: game_minute_1.GameMinute.FULL_TIME, to: new game_minute_1.GameMinute('91') }, expected: true },
            { input: { description: '92 (FT - 91): false', minute: new game_minute_1.GameMinute('92'), from: game_minute_1.GameMinute.FULL_TIME, to: new game_minute_1.GameMinute('91') }, expected: false },
            { input: { description: '120+5 (FT - AET): true', minute: new game_minute_1.GameMinute('120+5'), from: game_minute_1.GameMinute.FULL_TIME, to: game_minute_1.GameMinute.AFTER_EXTRA_TIME }, expected: true },
            { input: { description: '45+1 (44 - 46): true', minute: new game_minute_1.GameMinute('45+1'), from: new game_minute_1.GameMinute('44'), to: new game_minute_1.GameMinute('46') }, expected: true },
            { input: { description: '90+2 (89 - 91): true', minute: new game_minute_1.GameMinute('90+2'), from: new game_minute_1.GameMinute('89'), to: new game_minute_1.GameMinute('91') }, expected: true },
            { input: { description: '46 (40 - 45+5): false', minute: new game_minute_1.GameMinute('46'), from: new game_minute_1.GameMinute('40'), to: new game_minute_1.GameMinute('45+5') }, expected: false },
            { input: { description: 'HT (40 - 45+5): false', minute: game_minute_1.GameMinute.HALF_TIME, from: new game_minute_1.GameMinute('40'), to: new game_minute_1.GameMinute('45+5') }, expected: false },
            { input: { description: '45+5 (40 - 45+5): true', minute: new game_minute_1.GameMinute('45+5'), from: new game_minute_1.GameMinute('40'), to: new game_minute_1.GameMinute('45+5') }, expected: true },
        ])('$input.description', ({ input, expected }) => {
            const { minute, from, to } = input;
            (0, globals_1.expect)((0, functional_queries_1.isMinuteInPeriod)(minute, from, to)).toBe(expected);
        });
    });
    (0, globals_1.describe)('filterGoalDifferenceInPeriod', () => {
        globals_1.it.each([
            { input: { description: "two goals behind after 60th: true", goalEvents: HOME_3_2_TURNAROUND, goalDifference: -2, from: new game_minute_1.GameMinute("60"), to: game_minute_1.GameMinute.FULL_TIME }, expected: true },
            { input: { description: "two goals behind after 61th: false", goalEvents: HOME_3_2_TURNAROUND, goalDifference: -2, from: new game_minute_1.GameMinute("61"), to: game_minute_1.GameMinute.FULL_TIME }, expected: false },
            { input: { description: "three goals ahead after 60th: true", goalEvents: HOME_5_0, goalDifference: 3, from: new game_minute_1.GameMinute("60"), to: game_minute_1.GameMinute.FULL_TIME }, expected: true },
            { input: { description: "three goals ahead after 90th: true", goalEvents: HOME_5_0, goalDifference: 3, from: new game_minute_1.GameMinute("90"), to: game_minute_1.GameMinute.FULL_TIME }, expected: true },
            { input: { description: "four goals ahead after 90th: true", goalEvents: HOME_5_0, goalDifference: 4, from: new game_minute_1.GameMinute("90"), to: game_minute_1.GameMinute.FULL_TIME }, expected: true },
        ])('$input.description', ({ input, expected }) => {
            const { goalEvents: goals, goalDifference, from, to } = input;
            (0, globals_1.expect)((0, functional_queries_1.filterGoalDifferenceInPeriod)(goals, goalDifference, from, to)).toBe(expected);
        });
    });
    (0, globals_1.describe)('findLongestGameStreak', () => {
        (0, globals_1.it)('should find the longest streak of 5 games in between the games', () => {
            var _a;
            const notLostCondition = (game) => {
                return game.resultTendency !== 'l';
            };
            const games = [
                { id: 1, resultTendency: 'w' },
                { id: 2, resultTendency: 'l' },
                { id: 3, resultTendency: 'd' },
                { id: 4, resultTendency: 'd' },
                { id: 5, resultTendency: 'w' },
                { id: 6, resultTendency: 'l' },
                { id: 7, resultTendency: 'd' },
                { id: 8, resultTendency: 'w' },
                { id: 9, resultTendency: 'w' },
                { id: 10, resultTendency: 'w' },
                { id: 11, resultTendency: 'd' },
                { id: 12, resultTendency: 'l' },
            ];
            const actualIds = (_a = (0, functional_queries_1.findLongestGameStreak)(games, notLostCondition, 3)) === null || _a === void 0 ? void 0 : _a.items.map(game => game.id);
            (0, globals_1.expect)(actualIds).toStrictEqual([7, 8, 9, 10, 11]);
        });
        (0, globals_1.it)('should find the longest streak of 5 games at the end', () => {
            var _a;
            const notLostCondition = (game) => {
                return game.resultTendency !== 'l';
            };
            const games = [
                { id: 1, resultTendency: 'w' },
                { id: 2, resultTendency: 'l' },
                { id: 3, resultTendency: 'd' },
                { id: 4, resultTendency: 'd' },
                { id: 5, resultTendency: 'w' },
                { id: 12, resultTendency: 'l' },
                { id: 6, resultTendency: 'l' },
                { id: 7, resultTendency: 'd' },
                { id: 8, resultTendency: 'w' },
                { id: 9, resultTendency: 'w' },
                { id: 10, resultTendency: 'w' },
                { id: 11, resultTendency: 'd' },
            ];
            const actualIds = (_a = (0, functional_queries_1.findLongestGameStreak)(games, notLostCondition, 3)) === null || _a === void 0 ? void 0 : _a.items.map(game => game.id);
            (0, globals_1.expect)(actualIds).toStrictEqual([7, 8, 9, 10, 11]);
        });
        (0, globals_1.it)('should find the longest streak of 5 games at the beginning', () => {
            var _a;
            const notLostCondition = (game) => {
                return game.resultTendency !== 'l';
            };
            const games = [
                { id: 7, resultTendency: 'd' },
                { id: 8, resultTendency: 'w' },
                { id: 9, resultTendency: 'w' },
                { id: 10, resultTendency: 'w' },
                { id: 11, resultTendency: 'd' },
                { id: 2, resultTendency: 'l' },
                { id: 1, resultTendency: 'w' },
                { id: 3, resultTendency: 'd' },
                { id: 4, resultTendency: 'd' },
                { id: 5, resultTendency: 'w' },
                { id: 12, resultTendency: 'l' },
                { id: 6, resultTendency: 'l' },
            ];
            const actualIds = (_a = (0, functional_queries_1.findLongestGameStreak)(games, notLostCondition, 3)) === null || _a === void 0 ? void 0 : _a.items.map(game => game.id);
            (0, globals_1.expect)(actualIds).toStrictEqual([7, 8, 9, 10, 11]);
        });
        (0, globals_1.it)('should return null if no matching streak could be found', () => {
            const notLostCondition = (game) => {
                return game.resultTendency !== 'l';
            };
            const games = [
                { id: 1, resultTendency: 'w' },
                { id: 2, resultTendency: 'l' },
                { id: 3, resultTendency: 'd' },
                { id: 4, resultTendency: 'd' },
                { id: 5, resultTendency: 'w' },
                { id: 6, resultTendency: 'l' },
                { id: 7, resultTendency: 'd' },
                { id: 8, resultTendency: 'w' },
                { id: 9, resultTendency: 'w' },
                { id: 10, resultTendency: 'w' },
                { id: 11, resultTendency: 'd' },
                { id: 12, resultTendency: 'l' },
            ];
            (0, globals_1.expect)((0, functional_queries_1.findLongestGameStreak)(games, notLostCondition, 6)).toBeNull();
        });
        (0, globals_1.it)('should return null if no games were passed', () => {
            const notLostCondition = (game) => {
                return game.resultTendency !== 'l';
            };
            (0, globals_1.expect)((0, functional_queries_1.findLongestGameStreak)([], notLostCondition, 2)).toBeNull();
        });
        (0, globals_1.it)('should return the longest streak even if there is a shorter one found first', () => {
            var _a;
            const notLostCondition = (game) => {
                return game.resultTendency !== 'l';
            };
            const games = [
                { id: 1, resultTendency: 'w' },
                { id: 2, resultTendency: 'l' },
                { id: 3, resultTendency: 'd' },
                { id: 4, resultTendency: 'd' },
                { id: 5, resultTendency: 'w' },
                { id: 6, resultTendency: 'l' },
                { id: 7, resultTendency: 'd' },
                { id: 8, resultTendency: 'w' },
                { id: 9, resultTendency: 'w' },
                { id: 10, resultTendency: 'w' },
                { id: 11, resultTendency: 'd' },
                { id: 12, resultTendency: 'l' },
            ];
            const actualIds = (_a = (0, functional_queries_1.findLongestGameStreak)(games, notLostCondition, 3)) === null || _a === void 0 ? void 0 : _a.items.map(game => game.id);
            (0, globals_1.expect)(actualIds).toStrictEqual([7, 8, 9, 10, 11]);
        });
    });
});
