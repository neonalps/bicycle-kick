import { CreateGameRequestDto } from "@src/model/external/dto/create-game-request";
import { ExternalProvider } from "@src/model/type/external-provider";
import { ExternalGameProvider } from "../game-provider";
import { SofascoreGameDto } from "./types";
import { SeasonService } from "@src/module/season/service";
import { DateSource } from "@src/util/date";

export class SofascoreGameProvider implements ExternalGameProvider<SofascoreGameDto> {

    private readonly type = ExternalProvider.Sofascore;

    constructor(
        private readonly dateSource: DateSource,
        private readonly seasonService: SeasonService,
    ) {}

    getType(): ExternalProvider {
        return this.type;
    }

    async provide(input: SofascoreGameDto): Promise<CreateGameRequestDto> { 
        const [
            season
        ] = await Promise.all([
            this.seasonService.getForDate(this.dateSource.getDateFromUnixTimestamp(input.event.startTimestamp)),
        ]);

        if (season === null) {
            throw new Error(`Failed to determine season for input: ${input.event.startTimestamp}`);
        }

        /*const gameRequestDto: CreateGameRequestDto = {
            seasonId: season.id,
        }*/

        throw new Error();
    }
    
}