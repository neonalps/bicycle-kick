import { HttpClient } from "@src/http/client";
import { HTMLElement, NodeType, parse } from 'node-html-parser';
import { ExternalFixture, ExternalMatchdayDetails, ExternalTablePosition, FetchMatchdayDetailsRequest } from "@src/module/matchday-details/types";
import { ScoreTuple } from "@src/model/internal/score";
import { MatchdayDetailsProvider } from "@src/module/matchday-details/provider";
import { ExternalProvider } from "@src/model/type/external-provider";
import { GameStatus } from "@src/model/type/game-status";
import { isDefined } from "@src/util/common";

type GameScore = {
    fullTime: ScoreTuple;
    halfTime: ScoreTuple;
    afterExtraTime?: ScoreTuple;
    afterPenaltyShootOut?: ScoreTuple;
}

export class WeltfussballClient implements MatchdayDetailsProvider {

    private static readonly BASE_URL = `https://www.weltfussball.at`;
    private static readonly MATCHDAY_BASE_URL = WeltfussballClient.BASE_URL + `/spielplan`;

    constructor(private readonly http: HttpClient) {}

    supports(request: FetchMatchdayDetailsRequest): boolean {
        return [1, 2, 4].includes(request.competition.id);
    }

    getName(): ExternalProvider {
        return ExternalProvider.Weltfussball;
    }

    async provideMatchDetails(request: FetchMatchdayDetailsRequest): Promise<ExternalMatchdayDetails> {
        return await this.loadMatchdayDetails(request);
    }

    private buildRequestUrl(spec: FetchMatchdayDetailsRequest): string {
        return `${WeltfussballClient.MATCHDAY_BASE_URL}/${this.buildCompetitionUrlPart(spec)}`;
    }

    private buildCompetitionUrlPart(spec: FetchMatchdayDetailsRequest): string {
        const seasonString = spec.season.name.replace('/', '-');
        switch (spec.competition.id) {
            case 1:
                return `aut-bundesliga-${seasonString}-meistergruppe-spieltag/${spec.competitionRound}/`;
            case 2:
                return `aut-bundesliga-${seasonString}-spieltag/${spec.competitionRound}/`;
            case 4:
                return `aut-oefb-cup-${seasonString}-${this.getCupCompetitionRoundString(spec)}/0/`;
            default:
                throw new Error(`No handler for competition ID ${spec.competition.id}`);
        }
    }

    private async loadMatchdayDetails(request: FetchMatchdayDetailsRequest): Promise<ExternalMatchdayDetails> {
        const htmlResult = await this.http.get<string>(this.buildRequestUrl(request), { textOnly: true });
        const root = parse(htmlResult.body);

        const tables = root.querySelectorAll('.standard_tabelle');

        const result: ExternalMatchdayDetails = {};
        
        let tableIndex = 0;
        for (const table of tables) {
            const tableRows = table.querySelectorAll('tr');
            if (tableIndex === 0) {
                // fixtures
                result.fixtures = this.parseFixtures(tableRows);
            } else if (tableIndex === 1 && request.competition.id !== 4) {
                // table positions
                result.table = this.parseTablePositions(tableRows);
            }

            tableIndex++;
        }

        return result;
    }

    private getCupCompetitionRoundString(spec: FetchMatchdayDetailsRequest): string {
        if (spec.competitionRound === "1" || spec.competitionRound === "2") {
            return `${spec.competitionRound}-runde`;
        }

        switch (spec.competitionRound) {
            case 'final':
                return 'finale';
            case 'semifinal':
                return 'halbfinale';
            case 'quarterfinal':
                return 'viertelfinale';
            case 'roundOf16':
                return 'achtelfinale';
            default:
                throw new Error(`Unhandled cup competition round ${spec.competitionRound}`);
        }
    }

    private parseFixtures(rows: HTMLElement[]): ExternalFixture[] {
        const tempFixtures: string[][] = [];
        for (const row of rows) {
            const fixtureRow: string[] = [];
            for (const columnNode of row.childNodes) {
                if (columnNode.nodeType === NodeType.ELEMENT_NODE) {
                    const textContent = columnNode.textContent.trim();
                    if (textContent.length > 0 && textContent !== "-") {
                        fixtureRow.push(textContent);
                    }

                    // look for a tags in the children (will contain fixture link)
                    const fixtureLinkTag = columnNode.childNodes.find(childNode => childNode.nodeType === NodeType.ELEMENT_NODE && childNode.rawTagName === 'a');
                    if (fixtureLinkTag) {
                        const fixtureLink = (fixtureLinkTag as HTMLElement).getAttribute('href');

                        if (fixtureLink?.startsWith('/spielbericht')) {
                            fixtureRow.push(fixtureLink);
                        }
                    }
                }
            }
            tempFixtures.push(fixtureRow);
        }

        const fixtures: ExternalFixture[] = [];
        
        let currentDate: string | null = null;
        for (const tempFixture of tempFixtures) {
            const potentialDate = tempFixture[0];
            const firstColumnIsDate = potentialDate.length === 10;
            if (firstColumnIsDate && currentDate !== potentialDate) {
                currentDate = potentialDate;
            }

            const indexModifier = firstColumnIsDate ? 0 : -1;
            const kickoffTime = tempFixture[1 + indexModifier];

            const scores = tempFixture[4 + indexModifier].trim();

            const kickoffIsoString = [
                currentDate?.substring(6, 10),
                '-',
                currentDate?.substring(3, 5),
                '-',
                currentDate?.substring(0, 2),
                'T',
                kickoffTime,
                ':00.000',
            ].join('');

            const gameScore = this.parseScoreString(scores);

            const parsedFixture: ExternalFixture = {
                kickoff: kickoffIsoString,
                status: GameStatus.Finished,        // TODO implement
                home: {
                    name: tempFixture[2 + indexModifier],
                },
                away: {
                    name: tempFixture[3 + indexModifier],
                },
                halfTime: gameScore.halfTime,
                fullTime: gameScore.fullTime,
                href: `${WeltfussballClient.BASE_URL}${tempFixture[5 + indexModifier]}`,
            };

            if (isDefined(gameScore.afterExtraTime)) {
                parsedFixture.afterExtraTime = gameScore.afterExtraTime;
            }

            if (isDefined(gameScore.afterPenaltyShootOut)) {
                parsedFixture.afterPenaltyShootOut = gameScore.afterPenaltyShootOut;
            }

            fixtures.push(parsedFixture);
        }

        return fixtures;
    }

    private parseScoreString(scoreString: string): GameScore {
        if (scoreString.endsWith("n.V.") || scoreString.endsWith("n.V")) {
            return {
                fullTime: this.parseScoreTuple(scoreString.substring(10, 13)),
                halfTime: this.parseScoreTuple(scoreString.substring(5, 8)),
                afterExtraTime: this.parseScoreTuple(scoreString.substring(0, 3)),
            }
        } else if (scoreString.endsWith("i.E.") || scoreString.endsWith("i.E")) {
            return {
                afterPenaltyShootOut: this.parseScoreTuple(scoreString.substring(0, 3)),
                fullTime: this.parseScoreTuple(scoreString.substring(10, 13)),
                halfTime: this.parseScoreTuple(scoreString.substring(5, 8)),
                afterExtraTime: this.parseScoreTuple(scoreString.substring(15, 18)),
            }
        } else {
            return {
                fullTime: this.parseScoreTuple(scoreString.substring(0, 3)),
                halfTime: this.parseScoreTuple(scoreString.substring(5, 8)),
            }
        }
    }

    private parseScoreTuple(score: string): ScoreTuple {
        const scoreParts = score.split(':');
        if (scoreParts.length !== 2) {
            throw new Error(`Illegal score format: ${score}`);
        }
        return scoreParts.map(item => Number(item)) as ScoreTuple;
    }

    private parseTablePositions(rows: HTMLElement[]): ExternalTablePosition[] {
        const tempTablePositions: string[][] = [];
        for (const row of rows) {
            const tablePositionRow: string[] = [];
            for (const columnNode of row.childNodes) {
                if (columnNode.nodeType === NodeType.ELEMENT_NODE) {
                    const textContent = columnNode.textContent.trim();
                    if (textContent.length > 0) {
                        tablePositionRow.push(textContent);
                    }
                }
            }
            tempTablePositions.push(tablePositionRow);
        }
        
        let lastSeenPosition = 0;
        const tablePositions: ExternalTablePosition[] = [];
        for (const tempTablePosition of tempTablePositions) {
            if (tempTablePosition[0] === '#') {
                continue;
            }

            const currentPosition = Number(tempTablePosition[0]);
            if (!isNaN(currentPosition)) {
                lastSeenPosition = currentPosition;
            }

            const indexModifier = isNaN(currentPosition) ? -1 : 0;

            const goalDifference = tempTablePosition[6 + indexModifier].split(':').map(item => Number(item));

            tablePositions.push({
                position: lastSeenPosition,
                club: {
                    name: tempTablePosition[1 + indexModifier]
                        .replaceAll('(N)', '')
                        .replaceAll('(M)', '')
                        .replaceAll('(P)', '')
                        .replaceAll('(M,P)', '')
                        .trim(),
                },
                gamesPlayed: Number(tempTablePosition[2 + indexModifier]),
                wins: Number(tempTablePosition[3 + indexModifier]),
                draws: Number(tempTablePosition[4 + indexModifier]),
                defeats: Number(tempTablePosition[5 + indexModifier]),
                goalsFor: goalDifference[0],
                goalsAgainst: goalDifference[1],
                points: Number(tempTablePosition[8 + indexModifier])
            })
        }

        return tablePositions;
    }

}