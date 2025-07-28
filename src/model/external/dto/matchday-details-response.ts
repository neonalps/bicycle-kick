import { FixtureDto } from "./fixture";
import { SmallCompetitionDto } from "./small-competition";
import { TablePositionDto } from "./table-position";

export interface MatchdayDetailsResponseDto {
    competition: SmallCompetitionDto;
    fixtures?: FixtureDto[];
    table?: TablePositionDto[];
}