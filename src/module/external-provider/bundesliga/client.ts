import { HttpClient } from "@src/http/client";
import { HTMLElement, parse } from 'node-html-parser';
import { ExternalFixture, ExternalMatchdayDetails, ExternalTablePosition, FetchMatchdayDetailsRequest } from "@src/module/matchday-details/types";
import { ScoreTuple } from "@src/model/internal/score";
import { MatchdayDetailsProvider } from "@src/module/matchday-details/provider";
import { ExternalProvider } from "@src/model/type/external-provider";
import { GameStatus } from "@src/model/type/game-status";
import { promiseAllObject } from "@src/util/common";

export class BundesligaClient implements MatchdayDetailsProvider {

    private static readonly BASE_URL = `https://www.bundesliga.at/de`;
    private static readonly TABLE_BASE_URL = BundesligaClient.BASE_URL + `/tabelle/saison-`;
    private static readonly MATCHDAY_BASE_URL = BundesligaClient.BASE_URL + `/spielplan/saison-`;

    constructor(private readonly http: HttpClient) {}

    getName(): ExternalProvider {
        return ExternalProvider.Bundesliga;
    }

    supports(request: FetchMatchdayDetailsRequest): boolean {
        return [1, 2].includes(request.competition.id);
    }

    async provideMatchDetails(request: FetchMatchdayDetailsRequest): Promise<ExternalMatchdayDetails> {
        return await promiseAllObject({
            fixtures: this.loadFixtures(request),
            table: this.loadTableDetails(request),
        })
    }

    private buildTableRequestUrl(spec: FetchMatchdayDetailsRequest): string {
        if (spec.competition.id !== 1 && spec.competition.id !== 2) {
            throw new Error(``)
        }

        return `${BundesligaClient.TABLE_BASE_URL}${spec.season.name.replace('/', '-')}`;
    }

    private buildMatchdayRequestUrl(spec: FetchMatchdayDetailsRequest): string {
        if (spec.competition.id !== 1 && spec.competition.id !== 2) {
            throw new Error(``)
        }

        return `${BundesligaClient.MATCHDAY_BASE_URL}${spec.season.name.replace('/', '-')}`;
    }

    private async loadFixtures(request: FetchMatchdayDetailsRequest): Promise<ExternalFixture[]> {
        const htmlResult = await this.http.get<string>(this.buildMatchdayRequestUrl(request) + `?spieltag=${request.competitionRound}`, { textOnly: true });
        const root = parse(htmlResult.body);

        const main = root.querySelector('main');
        if (main === null) {
            throw new Error(`Main not found`);
        }

        const result: ExternalFixture[] = [];

        // find fixture content
        const fixtureMain = main.childNodes[1].childNodes[1].childNodes[0].childNodes[2];

        for (const dayNode of fixtureMain.childNodes) {
            const day = dayNode.childNodes[0].textContent;

            const dayParts = day.split(" ").slice(1);
            
            const kickoffDayPart = `${dayParts[2]}-${this.getMonth(dayParts[1])}-${dayParts[0].replace('.', '').padStart(2, '0')}`;

            for (const gameNode of dayNode.childNodes[1].childNodes[0].childNodes[1].childNodes) {
                const time = gameNode.childNodes[2].textContent;

                const kickoff = `${kickoffDayPart}T${time}:00.000`;

                const detailsLinkNode = gameNode.childNodes[1].childNodes[1];
                const detailsLink = (detailsLinkNode as HTMLElement).getAttribute('href');

                const homeClubNode = gameNode.childNodes[3].childNodes[1].childNodes[0];
                const homeClub = (homeClubNode as HTMLElement).getAttribute('href');
                const homeClubId = homeClub?.substring(homeClub.lastIndexOf('/') + 1) as string;

                const awayClubNode = gameNode.childNodes[4].childNodes[1].childNodes[0];
                const awayClub = (awayClubNode as HTMLElement).getAttribute('href');
                const awayClubId = awayClub?.substring(awayClub.lastIndexOf('/') + 1) as string;

                const fullTimeScoreNode = gameNode.childNodes[5].childNodes[1].childNodes[0].childNodes[0];

                let fullTime: ScoreTuple | undefined;
                let halfTime: ScoreTuple | undefined;
                if (fullTimeScoreNode.textContent !== "-:-" && fullTimeScoreNode.textContent !== "LIVE") {
                    fullTime = this.parseScoreTuple(fullTimeScoreNode.textContent);

                    const halfTimeScoreNode = gameNode.childNodes[5].childNodes[1].childNodes[0].childNodes[1];
                    halfTime = this.parseScoreTuple(halfTimeScoreNode.textContent.trim().substring(1, 4));
                }

                result.push({
                    status: fullTime ? GameStatus.Finished : fullTimeScoreNode.textContent === "LIVE" ? GameStatus.Ongoing : GameStatus.Scheduled,
                    kickoff: kickoff,
                    href: [BundesligaClient.BASE_URL, detailsLink].join(''),
                    home: {
                        name: homeClubId,
                    },
                    away: {
                        name: awayClubId,
                    },
                    fullTime: fullTime,
                    halfTime: halfTime,
                });
            }
        }
        
        return result;
    }

    private async loadTableDetails(request: FetchMatchdayDetailsRequest): Promise<ExternalTablePosition[]> {
        const htmlResult = await this.http.get<string>(this.buildTableRequestUrl(request) + `?spieltag=${request.competitionRound}`, { textOnly: true });
        const root = parse(htmlResult.body);

        const table = root.querySelector('table');
        if (table === null) {
            throw new Error(`Table not found`);
        }

        const result: ExternalTablePosition[] = [];
        
        const tableBody = root.querySelector('tbody');
        if (tableBody === null) {
            throw new Error('Table body not found');
        }
        for (const tableRow of tableBody.childNodes) {
            let clubId: string;
            let position: number;
            let gamesPlayed: number;
            let gamesWon: number;
            let gamesDrawn: number;
            let gamesLost: number;
            let goalsFor: number;
            let goalsAgainst: number;
            let points: number;
            
            let columnIndex = 0;
            for (const column of tableRow.childNodes) {
                // see if there is a link element (to get the club ID)
                for (const columnChildNode of column.childNodes) {
                    if (columnChildNode.rawTagName === 'a') {
                        const clubLink = (columnChildNode as HTMLElement).getAttribute('href');
                        clubId = clubLink?.substring(clubLink.lastIndexOf('/') + 1) as string;
                    }
                }

                if (columnIndex === 0) {
                    position = Number(column.textContent);
                } else if (columnIndex === 4) {
                    gamesPlayed = Number(column.textContent);
                } else if (columnIndex === 5) {
                    gamesWon = Number(column.textContent);
                } else if (columnIndex === 6) {
                    gamesDrawn = Number(column.textContent);
                } else if (columnIndex === 7) {
                    gamesLost = Number(column.textContent);
                } else if (columnIndex === 8) {
                    goalsFor = Number(column.textContent);
                } else if (columnIndex === 9) {
                    goalsAgainst = Number(column.textContent);
                } else if (columnIndex === 11) {
                    points = Number(column.textContent);
                }

                columnIndex++;
            }

            result.push({
                club: {
                    name: clubId!,
                },
                position: position!,
                gamesPlayed: gamesPlayed!,
                wins: gamesWon!,
                draws: gamesDrawn!,
                defeats: gamesLost!,
                goalsFor: goalsFor!,
                goalsAgainst: goalsAgainst!,
                points: points!,
            })
        }

        return result;
    }

    private parseScoreTuple(score: string): ScoreTuple {
        const scoreParts = score.split(':');
        if (scoreParts.length !== 2) {
            throw new Error(`Illegal score format: ${score}`);
        }
        return scoreParts.map(item => Number(item.trim())) as ScoreTuple;
    }

    private getMonth(monthName: string): string {
        switch (monthName) {
            case 'Jänner':
            case 'Januar':
                return '01';
            case 'Februar':
            case 'Feber':
                return '02';
            case 'März':
                return '03';
            case 'April':
                return '04';
            case 'Mai': 
                return '05';
            case 'Juni':
                return '06';
            case 'Juli':
                return '07';
            case 'August':
                return '08';
            case 'September':
                return '09';
            case 'Oktober':
                return '10';
            case 'November':
                return '11';
            case 'Dezember':
                return '12';
            default:
                throw new Error(`Unhandled month name ${monthName}`);
        }
    }

}