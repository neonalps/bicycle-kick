import { describe, expect, it } from '@jest/globals'
import { Game } from '@src/model/internal/game';
import { GoalGameEvent } from '@src/model/internal/game-event-goal'
import { GameMinute } from '@src/model/internal/game-minute'
import { Score } from '@src/model/internal/score';
import { filterGoalDifferenceInPeriod, findLongestGameStreak, getScoreAfterMinute, ifPresent, isMinuteInPeriod, PlaceholderMatch, PresenceMatch } from '@src/util/functional-queries'

const HOME_2_1: Partial<GoalGameEvent>[] = [
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

const HOME_3_2_TURNAROUND: Partial<GoalGameEvent>[] = [
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

const HOME_5_0: Partial<GoalGameEvent>[] = [
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

describe('Functional queries', () => {
    describe('ifPresent', () => {
        const numbers = {
            "one": 1,
            "two": 2,
            "three": 3,
            "four": 4,
        };

        it('should resolve number matches using full number syntax', () => {
            ifPresent("When did Sturm last score three goals in the first half?", "score {goals:number} goals", (match: PresenceMatch) => {
                expect(match).toStrictEqual({
                    indexOfList: 4,
                    placeholders: {
                        "goals": {
                            raw: "three",
                            resolved: 3,
                        },
                    },
                });
            }, numbers);
        });

        it('should resolve number matches using shorthand number syntax', () => {
            ifPresent("When did Sturm last score three goals in the first half?", "score {goals:n} goals", (match: PresenceMatch) => {
                expect(match).toStrictEqual({
                    indexOfList: 4,
                    placeholders: {
                        "goals": {
                            raw: "three",
                            resolved: 3,
                        },
                    },
                });
            }, numbers);
        });

        it('should resolve multiple matches in a single string', () => {
            ifPresent("When did Sturm last win a game after being two goals behind in the second half?", "{goals:n} goals {tendency}", (match: PresenceMatch) => {
                expect(match).toStrictEqual({
                    indexOfList: 9,
                    placeholders: {
                        "goals": {
                            raw: "two",
                            resolved: 2,
                        },
                        "tendency": {
                            raw: "behind",
                            resolved: "behind",
                        },
                    },
                });
            });
        });
    });

    describe('getScoreAfterMinute', () => {
        type GetScoreAfterMinuteTest = {
            input: {
                description: string,
                goalEvents: Partial<GoalGameEvent>[],
                minute: GameMinute,
            },
            expected: Score,
        };

        it.each<GetScoreAfterMinuteTest>([
            { input: { description: 'no goals, full-time', goalEvents: [], minute: GameMinute.FULL_TIME }, expected: new Score(0, 0) },
            { input: { description: '2:1, full-time', goalEvents: HOME_2_1, minute: GameMinute.FULL_TIME, }, expected: new Score(2, 1) },
            { input: { description: '2:1, half-time', goalEvents: HOME_2_1, minute: GameMinute.HALF_TIME, }, expected: new Score(1, 0) },
            { input: { description: '2:1, 9th minute', goalEvents: HOME_2_1, minute: new GameMinute("9"), }, expected: new Score(0, 0) },
            { input: { description: '2:1, 10th minute', goalEvents: HOME_2_1, minute: new GameMinute("10"), }, expected: new Score(1, 0) },
            { input: { description: '2:1, 90th minute', goalEvents: HOME_2_1, minute: new GameMinute("90"), }, expected: new Score(2, 0) },
            { input: { description: '2:1, 90th minute +4', goalEvents: HOME_2_1, minute: new GameMinute("90+4"), }, expected: new Score(2, 0) },
            { input: { description: '3:2, 60th minute', goalEvents: HOME_3_2_TURNAROUND, minute: new GameMinute("60"), }, expected: new Score(0, 2) },
            { input: { description: '3:2, 61st minute', goalEvents: HOME_3_2_TURNAROUND, minute: new GameMinute("61"), }, expected: new Score(1, 2) },
        ])('$input.description', ({ input, expected }) => {
            const { goalEvents: goals, minute } = input;
            expect(getScoreAfterMinute(goals as GoalGameEvent[], minute)).toStrictEqual(expected);
        });
    });

    describe('isMinuteInPeriod', () => {
        type IsMinuteInPeriodTest = {
            input: {
                description: string,
                minute: GameMinute,
                from: GameMinute,
                to: GameMinute,
            },
            expected: boolean,
        };

        it.each<IsMinuteInPeriodTest>([
            { input: { description: '1 (HT - FT): false', minute: new GameMinute('1'), from: GameMinute.HALF_TIME, to: GameMinute.FULL_TIME }, expected: false },
            { input: { description: '45+1 (HT - FT): false', minute: new GameMinute('45+1'), from: GameMinute.HALF_TIME, to: GameMinute.FULL_TIME }, expected: false },
            { input: { description: '46 (HT - FT): true', minute: new GameMinute('46'), from: GameMinute.HALF_TIME, to: GameMinute.FULL_TIME }, expected: true },
            { input: { description: '90+1 (HT - FT): true', minute: new GameMinute('90+1'), from: GameMinute.HALF_TIME, to: GameMinute.FULL_TIME }, expected: true },
            { input: { description: '90+10 (HT - FT): true', minute: new GameMinute('90+10'), from: GameMinute.HALF_TIME, to: GameMinute.FULL_TIME }, expected: true },
            { input: { description: '91 (FT - 91): true', minute: new GameMinute('91'), from: GameMinute.FULL_TIME, to: new GameMinute('91') }, expected: true },
            { input: { description: '92 (FT - 91): false', minute: new GameMinute('92'), from: GameMinute.FULL_TIME, to: new GameMinute('91') }, expected: false },
            { input: { description: '120+5 (FT - AET): true', minute: new GameMinute('120+5'), from: GameMinute.FULL_TIME, to: GameMinute.AFTER_EXTRA_TIME }, expected: true },
            { input: { description: '45+1 (44 - 46): true', minute: new GameMinute('45+1'), from: new GameMinute('44'), to: new GameMinute('46') }, expected: true },
            { input: { description: '90+2 (89 - 91): true', minute: new GameMinute('90+2'), from: new GameMinute('89'), to: new GameMinute('91') }, expected: true },
            { input: { description: '46 (40 - 45+5): false', minute: new GameMinute('46'), from: new GameMinute('40'), to: new GameMinute('45+5') }, expected: false },
            { input: { description: 'HT (40 - 45+5): false', minute: GameMinute.HALF_TIME, from: new GameMinute('40'), to: new GameMinute('45+5') }, expected: false },
            { input: { description: '45+5 (40 - 45+5): true', minute: new GameMinute('45+5'), from: new GameMinute('40'), to: new GameMinute('45+5') }, expected: true },
        ])('$input.description', ({ input, expected }) => {
            const { minute, from, to } = input;
            expect(isMinuteInPeriod(minute, from, to)).toBe(expected);
        })
    });

    describe('filterGoalDifferenceInPeriod', () => {
        type FilterGoalDifferenceInPeriodTest = {
            input: {
                description: string;
                goalEvents: Partial<GoalGameEvent>[],
                goalDifference: number,
                from: GameMinute,
                to: GameMinute,
            },
            expected: boolean,
        };
        
        it.each<FilterGoalDifferenceInPeriodTest>([
            { input: { description: "two goals behind after 60th: true", goalEvents: HOME_3_2_TURNAROUND, goalDifference: -2, from: new GameMinute("60"), to: GameMinute.FULL_TIME }, expected: true },
            { input: { description: "two goals behind after 61th: false", goalEvents: HOME_3_2_TURNAROUND, goalDifference: -2, from: new GameMinute("61"), to: GameMinute.FULL_TIME }, expected: false },
            { input: { description: "three goals ahead after 60th: true", goalEvents: HOME_5_0, goalDifference: 3, from: new GameMinute("60"), to: GameMinute.FULL_TIME }, expected: true },
            { input: { description: "three goals ahead after 90th: true", goalEvents: HOME_5_0, goalDifference: 3, from: new GameMinute("90"), to: GameMinute.FULL_TIME }, expected: true },
            { input: { description: "four goals ahead after 90th: true", goalEvents: HOME_5_0, goalDifference: 4, from: new GameMinute("90"), to: GameMinute.FULL_TIME }, expected: true },
        ])('$input.description', ({ input, expected }) => {
            const { goalEvents: goals, goalDifference, from, to } = input;
            expect(filterGoalDifferenceInPeriod(goals as GoalGameEvent[], goalDifference, from, to)).toBe(expected);
        })
    });

    describe('findLongestGameStreak', () => {
        it('should find the longest streak of 5 games in between the games', () => {
            const notLostCondition = (game: Game): boolean => {
                return game.resultTendency !== 'l';
            };

            const games: Partial<Game>[] = [
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

            const actualIds = findLongestGameStreak(games as Game[], notLostCondition, 3)?.items.map(game => game.id);
            expect(actualIds).toStrictEqual([7, 8, 9, 10, 11]);
        });

        it('should find the longest streak of 5 games at the end', () => {
            const notLostCondition = (game: Game): boolean => {
                return game.resultTendency !== 'l';
            };

            const games: Partial<Game>[] = [
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

            const actualIds = findLongestGameStreak(games as Game[], notLostCondition, 3)?.items.map(game => game.id);
            expect(actualIds).toStrictEqual([7, 8, 9, 10, 11]);
        })

        it('should find the longest streak of 5 games at the beginning', () => {
            const notLostCondition = (game: Game): boolean => {
                return game.resultTendency !== 'l';
            };

            const games: Partial<Game>[] = [
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

            const actualIds = findLongestGameStreak(games as Game[], notLostCondition, 3)?.items.map(game => game.id);
            expect(actualIds).toStrictEqual([7, 8, 9, 10, 11]);
        })

        it('should return null if no matching streak could be found', () => {
            const notLostCondition = (game: Game): boolean => {
                return game.resultTendency !== 'l';
            };

            const games: Partial<Game>[] = [
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

            expect(findLongestGameStreak(games as Game[], notLostCondition, 6)).toBeNull();
        })

        it('should return null if no games were passed', () => {
            const notLostCondition = (game: Game): boolean => {
                return game.resultTendency !== 'l';
            };

            expect(findLongestGameStreak([], notLostCondition, 2)).toBeNull();
        })

        it('should return the longest streak even if there is a shorter one found first', () => {
            const notLostCondition = (game: Game): boolean => {
                return game.resultTendency !== 'l';
            };

            const games: Partial<Game>[] = [
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

            const actualIds = findLongestGameStreak(games as Game[], notLostCondition, 3)?.items.map(game => game.id);
            expect(actualIds).toStrictEqual([7, 8, 9, 10, 11]);
        })
    });
});