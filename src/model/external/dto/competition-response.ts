import { CompetitionId } from "@src/util/domain-types";
import { CompetitionTitleDto } from "./season-title";

export interface CompetitionResponseDto {
    id: CompetitionId;
    name: string;
    shortName: string;
    isDomestic: boolean;
    iconSmall?: string;
    iconLarge?: string;
    titles: CompetitionTitleDto[];
}