import { GameMinute } from "@src/model/internal/game-minute";
import { GameEventPostProcessingFilter } from "@src/module/advanced-query/post-processor/game-event-processing-filter";
import { GameEvent } from "@src/model/internal/game-event";
import { QueryContext } from "@src/module/advanced-query/context";

export interface MinuteFilterPayload {
    from: GameMinute;
    to: GameMinute;
};

export class MinuteFilter implements GameEventPostProcessingFilter {

    constructor(private readonly payload: MinuteFilterPayload) {}

    apply(_: QueryContext): void {}

    process(event: GameEvent): boolean {
        console.log(`[MinuteFilter] post processing game event: ${event.eventType}, ${event.minute}`);
        return !event.minute.isBefore(this.payload.from) && !event.minute.isAfter(this.payload.to);
    }
    
}