import { FixtureDto } from "./fixture";
import { TablePositionDto } from "./table-position";

export interface MatchdayDetailsResponseDto {
    fixtures?: FixtureDto[];
    table?: TablePositionDto[];
}