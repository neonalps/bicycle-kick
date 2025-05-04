import { CreateGameRequestDto } from "@src/model/external/dto/create-game-request";
import { ExternalProvider } from "@src/model/type/external-provider";
import { ExternalGameProvider, ExternalGameProviderConfig } from "../game-provider";
import { GamePlayer, Incident, SofascoreGameDto, Team, TeamLineup } from "./types";
import { GameStatus } from "@src/model/type/game-status";
import { TimeSource } from "@src/util/time";
import { ClubInputDto } from "@src/model/external/dto/club-input";
import { RefereeRole } from "@src/model/external/dto/referee-role";
import { ManagingRole } from "@src/model/type/managing-role";
import { CreateGamePlayerDto } from "@src/model/external/dto/create-game-player";
import { CreateGameEventDto } from "@src/model/external/dto/create-game-event";
import { CreateSubstitutionGameEventDto } from "@src/model/external/dto/create-game-event-substitution";
import { GameEventType } from "@src/model/external/dto/game-event-type";
import { CreateGoalGameEventDto } from "@src/model/external/dto/create-game-event-goal";
import { GoalType } from "@src/model/type/goal-type";
import { CreateInjuryTimeGameEventDto } from "@src/model/external/dto/create-game-event-injury-time";
import { CreateYellowCardGameEventDto } from "@src/model/external/dto/create-game-event-yellow-card";
import { BookableOffence } from "@src/model/type/bookable-offence";
import { CreateYellowRedCardGameEventDto } from "@src/model/external/dto/create-game-event-yellow-red-card";
import { CreateRedCardGameEventDto } from "@src/model/external/dto/create-game-event-red-card";
import { ExpulsionReason } from "@src/model/type/expulsion-reason";
import { PersonInputDto } from "@src/model/external/dto/person-input";
import { CreateVarDecisionGameEventDto } from "@src/model/external/dto/create-game-event-var-decision";
import { VarDecision } from "@src/model/type/var-decision";
import { GameMinute } from "@src/model/internal/game-minute";

type PersonName = {
    firstName: string;
    lastName: string;
}

export class SofascoreGameProvider implements ExternalGameProvider<SofascoreGameDto> {

    private readonly type = ExternalProvider.Sofascore;

    constructor(private readonly config: ExternalGameProviderConfig, private readonly timeSource: TimeSource) {}

    getType(): ExternalProvider {
        return this.type;
    }

    async provide(input: SofascoreGameDto): Promise<CreateGameRequestDto> { 
        const isHomeGame = this.config.mainTeamName.some(name => input.event.homeTeam.name.indexOf(name) >= 0);
        const isAwayGame = this.config.mainTeamName.some(name => input.event.awayTeam.name.indexOf(name) >= 0);

        if (!isHomeGame && !isAwayGame) {
            throw new Error(`Looks like neither home nor away team are the main team`);
        }

        if (isHomeGame === isAwayGame) {
            throw new Error(`It seems like both the home and away team are the main team`);
        }

        return {
            kickoff: this.timeSource.unixTimestampToDate(input.event.startTimestamp),
            status: GameStatus.Finished,
            isHomeGame,
            competition: {
                externalCompetition: {
                    provider: this.type,
                    id: input.event.tournament.id.toString(),
                    name: input.event.tournament.name,
                    shortName: input.event.tournament.name,
                }
            },
            competitionRound: input.event.roundInfo.round,
            opponent: this.getClubInputFromTeam(isHomeGame ? input.event.awayTeam : input.event.homeTeam),
            venue: {
                externalVenue: {
                    provider: this.type,
                    id: input.event.venue.id.toString(),
                    name: input.event.venue.name,
                    shortName: input.event.venue.name,
                    city: input.event.venue.city.name,
                    countryCode: input.event.venue.country.alpha2.toLocaleLowerCase(),
                    capacity: input.event.venue.capacity,
                    latitude: input.event.venue.venueCoordinates.latitude,
                    longitude: input.event.venue.venueCoordinates.longitude,
                }
            },
            referees: [
                { 
                    person: this.getPersonInput(input.event.referee),
                    sortOrder: 0,
                    role: RefereeRole.Referee,
                 }
            ],
            managersMain: [
                {
                    person: this.getPersonInput(isHomeGame ? input.homeManager : input.awayManager),
                    role: ManagingRole.HeadCoach,
                    forMain: true,
                    sortOrder: 0,
                }
            ],
            managersOpponent: [
                {
                    person: this.getPersonInput(isHomeGame ? input.awayManager : input.homeManager),
                    role: ManagingRole.HeadCoach,
                    forMain: false,
                    sortOrder: 0,
                }
            ],
            lineupMain: this.getLineup(isHomeGame ? input.home : input.away, true),
            lineupOpponent: this.getLineup(isHomeGame ? input.away : input.home, false),
            events: this.getEvents(input.incidents),
        }
    }

    private getPersonName(name: string): PersonName {
        const nameSplit = name.split(" ");
        return {
            firstName: nameSplit.slice(0, nameSplit.length - 1).join(" "),
            lastName: nameSplit.slice(nameSplit.length - 1).join(" "),
        }
    }

    private getPersonInput({ id, name, dateOfBirthTimestamp }: { id: number, name: string, dateOfBirthTimestamp?: number }): PersonInputDto {
        const personName = this.getPersonName(name);
        return {
            externalPerson: {
                provider: this.type,
                id: id.toString(),
                firstName: personName.firstName,
                lastName: personName.lastName,
                birthday: dateOfBirthTimestamp !== undefined ? this.timeSource.unixTimestampToDate(dateOfBirthTimestamp) : undefined,
            }
        }
    }

    private getClubInputFromTeam(team: Team): ClubInputDto {
        return {
            externalClub: {
                provider: this.type,
                id: team.id.toString(),
                name: team.name,
                shortName: team.shortName,
                city: team.venue.city.name,
                countryCode: team.country.alpha2.toLocaleLowerCase(),
                primaryColour: team.teamColors.primary,
                secondaryColour: team.teamColors.secondary,
            }
        }
    }

    private getLineup(lineup: TeamLineup, forMain: boolean): CreateGamePlayerDto[] {
        return lineup.players.map((item, idx) => {
            return {
                sortOrder: idx,
                shirt: item.shirtNumber,
                isCaptain: item.captain === true,
                isStarting: !item.substitute,
                person: this.getPersonInput(item.player),
                forMain,
            }
        });
    }

    private getEvents(incidents: Incident[]): CreateGameEventDto[] {
        return incidents
            .filter(item => !["period"].includes(item.incidentType))
            .sort((a, b) => {
                const first = new GameMinute(this.getMinute(a.time, a.addedTime));
                const second = new GameMinute(this.getMinute(b.time, b.addedTime));
                return first.compareTo(second);
            })
            .map((item, idx) => {
            switch (item.incidentType) {
                case 'goal':
                    return this.getGoalEvent(item, idx);
                case 'substitution':
                    return this.getSubstitutionEvent(item, idx);
                case 'card':
                    return this.getCardEvent(item, idx);
                case 'injuryTime':
                    return this.getInjuryTimeEvent(item, idx);
                case 'varDecision':
                    return this.getVarDecisionEvent(item, idx);
                default:
                    throw new Error(`Unhandled incident type ${item.incidentType}`);
            }
        })
    }

    private getGoalEvent(incident: Incident, sortOrder: number): CreateGoalGameEventDto {
        const goalInformation = incident.footballPassingNetworkAction.find(item => item.eventType === 'goal');

        return {
            type: GameEventType.Goal,
            sortOrder,
            minute: this.getMinute(incident.time, incident.addedTime),
            scoredBy: this.getPersonInput(incident.player as GamePlayer),
            assistBy: incident.assist1 ? this.getPersonInput(incident.assist1) : undefined,
            penalty: incident.incidentClass === 'penalty',
            goalType: goalInformation !== undefined ? this.parseGoalType(goalInformation.bodyPart) : 'other',
            ownGoal: incident.incidentClass === 'ownGoal',
            directFreeKick: false,      // TODO can we get that information?
            bicycleKick: false,
        }
    }

    private parseGoalType(bodyPart: string): GoalType {
        switch (bodyPart) {
            case "right-foot":
                return 'right';
            case "left-foot":
                return 'left';
            case "head":
                return 'head';
            default:
                console.log(`received body type ${bodyPart}`);
                return 'other';
        }
    }

    private getCardEvent(incident: Incident, sortOrder: number): CreateGameEventDto {
        switch (incident.incidentClass) {
            case 'yellow':
                return this.getYellowCardEvent(incident, sortOrder);
            case 'yellowRed':
                return this.getYellowRedCardEvent(incident, sortOrder);
            case 'red':
                return this.getRedCardEvent(incident, sortOrder);
            default:
                throw new Error(`Unhandled card incident class ${incident.incidentClass}`);
        }
    }

    private getYellowCardEvent(incident: Incident, sortOrder: number): CreateYellowCardGameEventDto {
        return {
            type: GameEventType.YellowCard,
            sortOrder,
            minute: this.getMinute(incident.time, incident.addedTime),
            affectedPlayer: incident.player !== undefined ? this.getPersonInput(incident.player as GamePlayer) : undefined,
            affectedManager: incident.manager !== undefined ? this.getPersonInput(incident.manager) : undefined,
            reason: this.parseBookableOffence(incident.reason?.toLocaleLowerCase()),
        }
    }

    private parseBookableOffence(reason?: string): BookableOffence {
        if (reason === undefined) {
            return 'other';
        }

        switch (reason) {
            case 'foul':
                return 'foul';
            default:
                return reason as BookableOffence;
        }
    }

    private getYellowRedCardEvent(incident: Incident, sortOrder: number): CreateYellowRedCardGameEventDto {
        return {
            type: GameEventType.YellowRedCard,
            sortOrder,
            minute: this.getMinute(incident.time, incident.addedTime),
            affectedPlayer: incident.player !== undefined ? this.getPersonInput(incident.player as GamePlayer) : undefined,
            affectedManager: incident.manager !== undefined ? this.getPersonInput(incident.manager) : undefined,
            reason: incident.reason?.toLocaleLowerCase() as BookableOffence,     // TODO transform?
        }
    }

    private getRedCardEvent(incident: Incident, sortOrder: number): CreateRedCardGameEventDto {
        return {
            type: GameEventType.RedCard,
            sortOrder,
            minute: this.getMinute(incident.time, incident.addedTime),
            affectedPlayer: incident.player !== undefined ? this.getPersonInput(incident.player as GamePlayer) : undefined,
            affectedManager: incident.manager !== undefined ? this.getPersonInput(incident.manager) : undefined,
            reason: this.parseExpulsionReason(incident.reason?.toLocaleLowerCase() ?? ''),
        }
    }

    private parseExpulsionReason(reason: string): ExpulsionReason {
        switch (reason) {
            case 'professional foul last man':
                return 'denialOfGoalScoringOpportunity';
            case 'argument':
                return 'argument';
            default:
                throw new Error(`Unhandled expulsion reason: ${reason}`);
        }
    }

    private getSubstitutionEvent(incident: Incident, sortOrder: number): CreateSubstitutionGameEventDto {
        return {
            type: GameEventType.Substitution,
            sortOrder,
            minute: this.getMinute(incident.time, incident.addedTime),
            playerOn: this.getPersonInput(incident.playerIn as GamePlayer),
            playerOff: this.getPersonInput(incident.playerOut as GamePlayer),
            injured: incident.injury ?? undefined,
        }
    }

    private getInjuryTimeEvent(incident: Incident, sortOrder: number): CreateInjuryTimeGameEventDto {
        return {
            type: GameEventType.InjuryTime,
            sortOrder,
            minute: this.getMinute(incident.time, incident.addedTime),
            additionalMinutes: incident.length as number,
        }
    }

    private getVarDecisionEvent(incident: Incident, sortOrder: number): CreateVarDecisionGameEventDto {
        return {
            type: GameEventType.VarDecision,
            sortOrder,
            minute: this.getMinute(incident.time, incident.addedTime),
            decision: this.parseVarDecision(incident.incidentClass),
            affectedPlayer: this.getPersonInput(incident.player as GamePlayer),
        }
    }

    private parseVarDecision(decision?: string): VarDecision {
        if (decision === undefined) {
            throw new Error(`No VAR decision passed`);
        }

        switch (decision) {
            case 'penaltyNotAwarded':
                return 'penalty';
            default:
                throw new Error(`Unhandled VAR decision ${decision}`);
        }
    }

    private getMinute(base: number, addedTime?: number): string {
        if (base < 0) {
            return `${90 + base}`;
        }

        return [base, addedTime].filter(item => item !== undefined && item !== 0).join('+');
    }
    
}