import { QueryContext } from "@src/module/advanced-query/context";
import { GameEventType } from "@src/model/external/dto/game-event-type";
import { GameEvent } from "@src/model/internal/game-event";
import { GameEventPostProcessingFilter } from "@src/module/advanced-query/post-processor/game-event-processing-filter";

export class PlayerSentOffGameEventFilter implements GameEventPostProcessingFilter {

    apply(_: QueryContext): void {}

    process(event: GameEvent): boolean {
        console.log(`[PlayerSentOffGameEventFilter] post processing game event: ${event.eventType}, ${event.minute}`);
        return [GameEventType.RedCard, GameEventType.YellowRedCard].includes(event.eventType);
    }
    
}