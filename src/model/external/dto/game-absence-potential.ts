import { OmitStrict } from "@src/util/types";
import { GameAbsenceDto } from "./game-absence";

export type PotentialGameAbsenceDto = OmitStrict<GameAbsenceDto, 'id'>;