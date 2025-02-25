import { Game } from "@src/model/internal/game";
import { GoalGameEvent } from "@src/model/internal/game-event-goal";
import { GameMinute } from "@src/model/internal/game-minute";
import { Streak } from "@src/model/internal/streak";
import { Score } from "@src/model/type/score";

export function filterGoalDifferenceInPeriod(orderedEvents: GoalGameEvent[], forMain: boolean, goalDifference: number, from: string, to: string): boolean {
    return orderedEvents.some(event => {
        const actualGoalDifference = event.scoreMain - event.scoreOpponent;

        return event.forMain === forMain && goalDifference === actualGoalDifference && isMinuteInPeriod(event.minute, from, to);
    })
}

export function isMinuteInPeriod(eventMinute: string, from: string, to: string): boolean {
    const eventGameMinute = new GameMinute(eventMinute);
    const fromGameMinute = new GameMinute(from);
    const toGameMinute = new GameMinute(to);

    return eventGameMinute.compareTo(fromGameMinute) >= 0 && eventGameMinute.compareTo(toGameMinute) <= 0;
}

export function getScoreAfterMinute(orderedEvents: GoalGameEvent[], minute: GameMinute): Score {
    let currentScore: Score = [0, 0];

    for (const event of orderedEvents) {
        const eventGameMinute = new GameMinute(event.minute);
        if (!eventGameMinute.isAfter(minute)) {
            currentScore = [event.scoreMain, event.scoreOpponent];
        } else {
            // once we are at an event after the minute we are looking for, we can return
            return currentScore;
        }
    }

    return currentScore;
}

export function findLongestGameStreak(orderedGames: Game[], condition: (game: Game) => boolean, minimumSequence: number = 3): Streak<Game> | null {
    let currentLongestStreakStartIndex: number | null = null;
    let currentLongestStreak = Math.max(minimumSequence - 1, 0);

    let ongoingStreakStartIndex: number | null = null;
    let ongoingStreak = 0;

    for (let i = 0; i < orderedGames.length; i++) {
        const game = orderedGames[i];

        if (condition(game)) {
            if (ongoingStreakStartIndex === null) {
                ongoingStreakStartIndex = i;
            }
            ongoingStreak += 1;
        } else {
            if (ongoingStreak > currentLongestStreak) {
                currentLongestStreak = ongoingStreak;
                currentLongestStreakStartIndex = ongoingStreakStartIndex;
            }

            ongoingStreakStartIndex = null;
            ongoingStreak = 0;
        }

    }

    if (currentLongestStreakStartIndex === null) {
        return null;
    }
}