import { ExternalProvider } from "@src/model/type/external-provider";
import { ExternalMatchdayDetails, FetchMatchdayDetailsRequest } from "./types";

export interface MatchdayDetailsProvider {
    getName(): ExternalProvider;
    provideMatchDetails(request: FetchMatchdayDetailsRequest): Promise<ExternalMatchdayDetails>;
}