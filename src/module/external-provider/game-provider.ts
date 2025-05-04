import { CreateGameRequestDto } from "@src/model/external/dto/create-game-request";
import { ExternalProvider } from "@src/model/type/external-provider";

export interface ExternalGameProviderConfig {
    mainTeamName: string[];
}

export interface ExternalGameProvider<T> {
    getType(): ExternalProvider;
    provide(input: T): Promise<CreateGameRequestDto>;
}