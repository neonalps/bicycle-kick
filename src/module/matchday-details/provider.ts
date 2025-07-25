import { ExternalProvider } from "@src/model/type/external-provider";
import { MatchdayDetails } from "./types";

export interface MatchdayDetailsProvider {
    getName(): ExternalProvider;
    provideMatchDetails(): Promise<MatchdayDetails>;
}