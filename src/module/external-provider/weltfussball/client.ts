import { HttpClient } from "@src/http/client";
import { HTMLElement, NodeType, parse } from 'node-html-parser';
import { ExternalFixture, ExternalMatchdayDetails, ExternalTablePosition, FetchMatchdayDetailsRequest } from "@src/module/matchday-details/types";
import { ScoreTuple } from "@src/model/internal/score";
import { MatchdayDetailsProvider } from "@src/module/matchday-details/provider";
import { ExternalProvider } from "@src/model/type/external-provider";
import { GameStatus } from "@src/model/type/game-status";

export class WeltfussballClient implements MatchdayDetailsProvider {

    private static readonly BASE_URL = `https://www.weltfussball.at`;
    private static readonly MATCHDAY_BASE_URL = WeltfussballClient.BASE_URL + `/spielplan`;

    constructor(private readonly http: HttpClient) {}

    getName(): ExternalProvider {
        return ExternalProvider.Weltfussball;
    }

    async provideMatchDetails(request: FetchMatchdayDetailsRequest): Promise<ExternalMatchdayDetails> {
        return await this.loadMatchdayDetails(request);
    }

    private buildRequestUrl(spec: FetchMatchdayDetailsRequest): string {
        return `${WeltfussballClient.MATCHDAY_BASE_URL}/${this.buildCompetitionUrlPart(spec)}/${spec.competitionRound}/`;
    }

    private buildCompetitionUrlPart(spec: FetchMatchdayDetailsRequest): string {
        switch (spec.competition.id) {
            case 1:
                return `aut-bundesliga-${spec.season.name.replace('/', '-')}-meistergruppe-spieltag`;
            case 2:
                return `aut-bundesliga-${spec.season.name.replace('/', '-')}-spieltag`;
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
            } else if (tableIndex === 1) {
                // table positions
                result.table = this.parseTablePositions(tableRows);
            }

            tableIndex++;
        }

        return result;
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

            const scores = tempFixture[4 + indexModifier].split(' ');

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

            fixtures.push({
                kickoff: kickoffIsoString,
                status: GameStatus.Finished,        // TODO implement
                home: {
                    name: tempFixture[2 + indexModifier],
                },
                away: {
                    name: tempFixture[3 + indexModifier],
                },
                fullTime: this.parseScoreTuple(scores[0]),
                halfTime: this.parseScoreTuple(scores[1].replaceAll('(', '').replaceAll(')', '')),
                href: `${WeltfussballClient.BASE_URL}${tempFixture[5 + indexModifier]}`,
            })
        }

        return fixtures;
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