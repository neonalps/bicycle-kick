import { Game } from "@src/model/internal/game";
import { GoalGameEvent } from "@src/model/internal/game-event-goal";
import { GameMinute } from "@src/model/internal/game-minute";
import { Score } from "@src/model/internal/score";
import { Streak } from "@src/model/internal/streak";

type PlaceholderType = 'number' | 'any';

interface PlaceholderDefintion {
    name: string;
    type: PlaceholderType;
}

export interface PlaceholderMatch {
    raw: string;
    resolved: string | number;
}

export interface PresenceMatch {
    indexOfList: number;
    placeholders: Record<string, PlaceholderMatch>; 
}

export function ifPresent(input: string, toSearchExpression: string, matchHandler: (match: PresenceMatch) => void, numbers?: Record<string, number>, startPosition?: number): void {
    const match = determineMatch(input, toSearchExpression, numbers, startPosition);
    if (match !== null) {
        matchHandler(match);
    }
}

function determineMatch(input: string, toSearchExpression: string, numbers?: Record<string, number>, startPosition?: number): PresenceMatch | null {
    const parts = input.split(" ");

    const toSearchParts = toSearchExpression.split(" ");

    const placeholderMap: Record<string, PlaceholderMatch> = {};

    const startFrom = startPosition !== undefined ? startPosition : 0;

    const inputLength = parts.length;
    for (let i = startFrom; i < inputLength; i++) {
        const part = parts[i];
        const toSearch = toSearchParts[0];

        const placeholder = getPlaceholderDefinition(toSearch);
        const match = getPlaceholderMatch(part, placeholder, numbers);

        if (part === toSearch || match !== null) {
            let isMatching = true;
            if (match !== null) {
                // store placeholder match in map
                placeholderMap[(placeholder as PlaceholderDefintion).name] = match;
            }

            // matching has started
            matchingLoop: for (let j = 1; j < toSearchParts.length; j++) {
                // strategy: peek at next elements to see if they also match
                if ((i + j) >= inputLength) {
                    // peeking not possible because end of input parts array is reached; abort matching
                    isMatching = false;
                    break matchingLoop;
                }

                const peekElement = parts[i + j];
                const peekToSearch = toSearchParts[j];

                const peekPlaceholder = getPlaceholderDefinition(peekToSearch);
                const peekMatch = getPlaceholderMatch(peekElement, peekPlaceholder, numbers);

                if (peekElement !== peekToSearch && peekMatch === null) {
                    // peek element did not result in a match; abort matching
                    isMatching = false;
                    break matchingLoop;
                }

                // we found another match
                if (peekMatch !== null) {
                    placeholderMap[(peekPlaceholder as PlaceholderDefintion).name] = peekMatch;
                }
            }

            if (isMatching) {
                return { indexOfList: i, placeholders: placeholderMap };
            }
        }
    }

    return null;
}

function getPlaceholderMatch(item: string, placeholder: PlaceholderDefintion | null, numbers?: Record<string, number>): PlaceholderMatch | null {
    if (placeholder === null) {
        return null;
    }

    if (placeholder.type === 'any') {
        return { raw: item, resolved: item };
    } else {
        // number
        if (!isNaN(item as any)) {
            return { raw: item, resolved: Number(item) };
        }

        if (numbers === undefined) {
            return null;
        }

        const numberMatch = numbers[item];
        if (numberMatch === undefined) {
            return null;
        }

        return { raw: item, resolved: numberMatch };
    }
}

function getPlaceholderDefinition(item: string): PlaceholderDefintion | null {
    if (!item.startsWith("{") || !item.endsWith("}")) {
        return null;
    }

    const itemContent = item.substring(1, item.length - 1);

    const itemContentParts = itemContent.split(":");
    if (itemContentParts.length === 0 || itemContentParts.length > 2) {
        return null;
    }

    const name = itemContentParts[0];

    if (itemContentParts.length === 1) {
        return { name, type: 'any' };
    } else {
        const placeholderType: PlaceholderType = ["n", "number"].includes(itemContentParts[1]) ? 'number' : 'any';
        return { name, type: placeholderType };
    }
}

export function filterGoalDifferenceInPeriod(orderedEvents: GoalGameEvent[], goalDifference: number, from: GameMinute, to: GameMinute): boolean {
    const goalDifferenceAtStart = getScoreAfterMinute(orderedEvents, from).getGoalDifference();
    if ((goalDifference < 0 && goalDifferenceAtStart < goalDifference) || 
            (goalDifference > 0 && goalDifferenceAtStart > goalDifference) ||
            (goalDifference === goalDifferenceAtStart)) {
        return true;
    }

    return orderedEvents.some(goalEvent => {
        const difference = new Score(goalEvent.scoreMain, goalEvent.scoreOpponent).getGoalDifference();
        return isMinuteInPeriod(goalEvent.minute, from, to) && 
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
        if (!event.minute.isAfter(minute)) {
            currentScore = new Score(event.scoreMain, event.scoreOpponent);
        } else {
            // once we are at an event after the minute we are looking for, we can return
            return currentScore;
        }
    }

    return currentScore;
}

export interface OccurrenceGroupResult<T> {
    count: number;
    items: T[];
}
export function groupByOccurrence<T>(items: T[]): OccurrenceGroupResult<T>[] {
    if (items.length === 0) {
        return [];
    }

    const occurrenceMap: Map<T, number> = new Map();
    for (const item of items) {
        const entry = occurrenceMap.get(item);
        if (entry !== undefined) {
            occurrenceMap.set(item, entry + 1);
        } else {
            occurrenceMap.set(item, 1);
        }
    }

    const reverseMap: Map<number, T[]> = new Map();
    occurrenceMap.forEach((value, key) => {
        const entry = reverseMap.get(value);
        if (entry !== undefined) {
            entry.push(key);
        } else {
            reverseMap.set(value, [key]);
        }
    });

    return Array.from(reverseMap.keys())
        .sort((a, b) => b - a)
        .map(occurrenceKey => {
            return {
                count: occurrenceKey,
                items: reverseMap.get(occurrenceKey) as T[],
            }
        });
}

export function groupByOccurrenceAndGetLargest<T>(items: T[]): T[] {
    if (items.length === 0) {
        return [];
    }

    const occurrenceResult = groupByOccurrence(items);
    
    let currentHighestItems: T[] = [];
    let currentHighestCount: number | null = null;

    for (const occurrence of occurrenceResult) {
        if (currentHighestCount === null || occurrence.count > currentHighestCount) {
            currentHighestItems = occurrence.items;
            currentHighestCount = occurrence.count;
        }
    }

    return currentHighestItems;
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