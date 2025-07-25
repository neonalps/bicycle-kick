import { HttpClient } from "@src/http/client";
import { HTMLElement, NodeType, parse } from 'node-html-parser';
import { Fixture, MatchdayDetails, TablePosition } from "@src/module/matchday-details/types";
import { ScoreTuple } from "@src/model/internal/score";
import { MatchdayDetailsProvider } from "@src/module/matchday-details/provider";
import { ExternalProvider } from "@src/model/type/external-provider";

export class WeltfussballClient implements MatchdayDetailsProvider {

    constructor(private readonly http: HttpClient) {}

    getName(): ExternalProvider {
        return ExternalProvider.Weltfussball;
    }

    async provideMatchDetails(): Promise<MatchdayDetails> {
        return await this.loadMatchdayDetails();
    }

    private async loadMatchdayDetails(): Promise<MatchdayDetails> {
        const htmlResult = await this.http.get<string>(`https://www.weltfussball.at/spielplan/aut-bundesliga-2024-2025-meistergruppe-spieltag/28/`, { textOnly: true });
        const root = parse(htmlResult.body);

        const tables = root.querySelectorAll('.standard_tabelle');

        const result: MatchdayDetails = {};
        
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

    private parseFixtures(rows: HTMLElement[]): Fixture[] {
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

        const fixtures: Fixture[] = [];
        
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
                ':00.000Z',
            ].join('');

            fixtures.push({
                kickoff: kickoffIsoString,
                home: {
                    name: tempFixture[2 + indexModifier],
                },
                away: {
                    name: tempFixture[3 + indexModifier],
                },
                fullTime: this.parseScoreTuple(scores[0]),
                halfTime: this.parseScoreTuple(scores[1].replaceAll('(', '').replaceAll(')', '')),
                href: tempFixture[5 + indexModifier],
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

    private parseTablePositions(rows: HTMLElement[]): TablePosition[] {
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
        
        const tablePositions: TablePosition[] = [];
        for (const tempTablePosition of tempTablePositions) {
            if (tempTablePosition[0] === '#') {
                continue;
            }

            const goalDifference = tempTablePosition[6].split(':').map(item => Number(item));

            tablePositions.push({
                position: Number(tempTablePosition[0]),
                club: {
                    name: tempTablePosition[1],
                },
                gamesPlayed: Number(tempTablePosition[2]),
                wins: Number(tempTablePosition[3]),
                draws: Number(tempTablePosition[4]),
                defeats: Number(tempTablePosition[5]),
                goalsFor: goalDifference[0],
                goalsAgainst: goalDifference[1],
                points: Number(tempTablePosition[8])
            })
        }

        return tablePositions;
    }

}