import { Game } from "@src/model/internal/game";
import { GoalGameEvent } from "@src/model/internal/game-event-goal";
import { GameMinute } from "@src/model/internal/game-minute";
import { Score } from "@src/model/internal/score";
import { Streak } from "@src/model/internal/streak";

export function filterGoalDifferenceInPeriod(orderedEvents: GoalGameEvent[], goalDifference: number, from: GameMinute, to: GameMinute): boolean {
    const goalDifferenceAtStart = getScoreAfterMinute(orderedEvents, from).getGoalDifference();
    if ((goalDifference < 0 && goalDifferenceAtStart < goalDifference) || 
            (goalDifference > 0 && goalDifferenceAtStart > goalDifference) ||
            (goalDifference === goalDifferenceAtStart)) {
        return true;
    }

    return orderedEvents.some(goalEvent => {
        const difference = new Score(goalEvent.scoreMain, goalEvent.scoreOpponent).getGoalDifference();
        return isMinuteInPeriod(new GameMinute(goalEvent.minute), from, to) && 
            ((goalDifference < 0 && difference < goalDifference) || 
                (goalDifference > 0 && difference > goalDifference) ||
                (goalDifference === difference));
    });
}

export function isMinuteInPeriod(eventMinute: GameMinute, from: GameMinute, to: GameMinute): boolean {
    return eventMinute.compareTo(from) >= 0 && eventMinute.compareTo(to) <= 0;
}

export function getScoreAfterMinute(orderedEvents: GoalGameEvent[], minute: GameMinute): Score {
    let currentScore = new Score(0, 0);

    for (const event of orderedEvents) {
        const eventGameMinute = new GameMinute(event.minute);
        if (!eventGameMinute.isAfter(minute)) {
            currentScore = new Score(event.scoreMain, event.scoreOpponent);
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

    if (ongoingStreak > currentLongestStreak) {
        currentLongestStreak = ongoingStreak;
        currentLongestStreakStartIndex = ongoingStreakStartIndex;
    }

    if (currentLongestStreakStartIndex === null) {
        return null;
    }

    return {
        items: orderedGames.slice(currentLongestStreakStartIndex, currentLongestStreakStartIndex + currentLongestStreak),
    }
}