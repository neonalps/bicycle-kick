import { Sql } from "@src/db";
import { ApplicationStatsResponseDto } from "@src/model/external/dto/overall-application-stats-response";
import { convertNumberString, promiseAllObject, requireSingleArrayElement } from "@src/util/common";

type CountResult = {
    cnt: string;
}

export class ApplicationStatsMapper {

    constructor(private readonly sql: Sql) {}

    async getApplicationStats(): Promise<ApplicationStatsResponseDto> {
        return await promiseAllObject({
            accountCount: this.getAccountCount(),
            gameCount: this.getGameCount(),
            personCount: this.getPersonCount(),
            gameEventCount: this.getGameEventCount(),
            gamePlayerCount: this.getGamePlayerCount(),
            gameManagerCount: this.getGameManagerCount(),
            gameRefereeCount: this.getGameRefereeCount(),
        });
    }

    private async getGameCount(): Promise<number> {
        const result = await this.sql<CountResult[]>`select count(1) as cnt from game`;
        return convertNumberString(requireSingleArrayElement(result).cnt);
    }

    private async getPersonCount(): Promise<number> {
        const result = await this.sql<CountResult[]>`select count(1) as cnt from person`;
        return convertNumberString(requireSingleArrayElement(result).cnt);
    }

    private async getGameEventCount(): Promise<number> {
        const result = await this.sql<CountResult[]>`select count(1) as cnt from game_events`;
        return convertNumberString(requireSingleArrayElement(result).cnt);
    }

    private async getGamePlayerCount(): Promise<number> {
        const result = await this.sql<CountResult[]>`select count(1) as cnt from game_players`;
        return convertNumberString(requireSingleArrayElement(result).cnt);
    }

    private async getGameManagerCount(): Promise<number> {
        const result = await this.sql<CountResult[]>`select count(1) as cnt from game_managers`;
        return convertNumberString(requireSingleArrayElement(result).cnt);
    }

    private async getGameRefereeCount(): Promise<number> {
        const result = await this.sql<CountResult[]>`select count(1) as cnt from game_referees`;
        return convertNumberString(requireSingleArrayElement(result).cnt);
    }

    private async getAccountCount(): Promise<number> {
        const result = await this.sql<CountResult[]>`select count(1) as cnt from account`;
        return convertNumberString(requireSingleArrayElement(result).cnt);
    }

}