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
import { CreatePenaltyShootOutGameEventDto } from "@src/model/external/dto/create-game-event-pso";
import { PsoResult } from "@src/model/type/pso-result";
import { CreatePenaltyMissedGameEventDto } from "@src/model/external/dto/create-game-event-penalty-missed";
import { PenaltyMissedReason } from "@src/model/type/penalty-missed-reason";

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

        const referees = [];
        if (input.event.referee) {
            referees.push({ 
                person: this.getPersonInput(input.event.referee),
                sortOrder: 0,
                role: RefereeRole.Referee,
            });
        }

        return {
            kickoff: this.timeSource.unixTimestampToDate(input.event.startTimestamp).toISOString(),
            status: GameStatus.Finished,
            isHomeGame,
            attendance: input.event.attendance,
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
                    capacity: input.event.venue.capacity ?? 0,
                    latitude: input.event.venue?.venueCoordinates?.latitude,
                    longitude: input.event.venue?.venueCoordinates?.longitude,
                }
            },
            referees,
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
                homeVenue: {
                    externalVenue: {
                        provider: this.type,
                        id: team.venue.id.toString(),
                        name: team.venue.name,
                        shortName: team.venue.name,
                        city: team.venue.city.name,
                        countryCode: team.venue.country.alpha2.toLocaleLowerCase(),
                        capacity: team.venue.capacity ?? 0,
                        latitude: team.venue?.venueCoordinates?.latitude,
                        longitude: team.venue?.venueCoordinates?.longitude,
                    }
                }
            }
        }
    }

    private getLineup(lineup: TeamLineup, forMain: boolean): CreateGamePlayerDto[] {
        return lineup.players.map((item, idx) => {
            return {
                sortOrder: idx + (forMain ? 0 : 100),
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
                const firstMinute = a.incidentType === 'penaltyShootout' ? this.getMinute(121, a.sequence) : this.getMinute(a.time, a.addedTime);
                const secondMinute = b.incidentType === 'penaltyShootout' ? this.getMinute(121, b.sequence) : this.getMinute(b.time, b.addedTime);

                const first = new GameMinute(firstMinute);
                const second = new GameMinute(secondMinute);
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
                    case 'penaltyShootout':
                        return this.getPenaltyShootOutEvent(item, idx);
                    case 'inGamePenalty':
                        return this.getPenaltyMissedEvent(item, idx);
                    default:
                        throw new Error(`Unhandled incident type ${item.incidentType}`);
                }
        })
    }

    private getGoalEvent(incident: Incident, sortOrder: number): CreateGoalGameEventDto {
        const goalInformation = incident.footballPassingNetworkAction?.find(item => item.eventType === 'goal');

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
            return BookableOffence.Other;
        }

        switch (reason) {
            case 'foul':
            case 'persistent fouling':
                return BookableOffence.Foul;
            case 'handball':
                return BookableOffence.Handball;
            case 'dangerous play':
                return BookableOffence.DangerousPlay;
            case 'simulation':
            case 'time wasting':
            case 'off the ball foul':
            case 'argument':
                return BookableOffence.UnsportingBehavious;
            case 'professional foul last man':
                return BookableOffence.DenialOfGoalScoringOpportunity;
            default:
                throw new Error(`Failed to parse bookable offence ${reason}`);
        }
    }

    private getYellowRedCardEvent(incident: Incident, sortOrder: number): CreateYellowRedCardGameEventDto {
        return {
            type: GameEventType.YellowRedCard,
            sortOrder,
            minute: this.getMinute(incident.time, incident.addedTime),
            affectedPlayer: incident.player !== undefined ? this.getPersonInput(incident.player as GamePlayer) : undefined,
            affectedManager: incident.manager !== undefined ? this.getPersonInput(incident.manager) : undefined,
            reason: this.parseBookableOffence(incident.reason?.toLocaleLowerCase()),
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
            case 'foul':
                return 'seriousFoulPlay';
            case 'violent conduct':
                return 'violentConduct';
            case '':
                console.info(`got empty expulsion reason - defaulted to violentConduct`);
                return 'violentConduct';
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
            reason: 'offside',   // we cannot know what it is, so we simply use offside
            affectedPlayer: this.getPersonInput(incident.player as GamePlayer),
        }
    }

    private getPenaltyMissedEvent(incident: Incident, sortOrder: number): CreatePenaltyMissedGameEventDto {
        return {
            type: GameEventType.PenaltyMissed,
            sortOrder,
            minute: this.getMinute(incident.time, incident.addedTime),
            takenBy: this.getPersonInput(incident.player as GamePlayer),
            reason: this.parsePenaltyMissedReason(incident.description as string),
        }
    }

    private getPenaltyShootOutEvent(incident: Incident, sortOrder: number): CreatePenaltyShootOutGameEventDto {
        return {
            type: GameEventType.PenaltyShootOut,
            sortOrder,
            minute: GameMinute.PSO.toString(),
            takenBy: this.getPersonInput(incident.player as GamePlayer),
            result: this.parsePsoResult(incident.incidentClass as string),
        }
    }

    private parsePenaltyMissedReason(reason: string): PenaltyMissedReason {
        if (reason === 'Goalkeeper save') {
            return 'saved';
        } else {
            return 'saved';
        }
    }

    private parsePsoResult(result: string): PsoResult {
        if (result === "scored") {
            return PsoResult.Goal;
        } else {
            // there is only "missed" in Sofascore
            return PsoResult.Saved;
        }
    }

    private parseVarDecision(decision?: string): VarDecision {
        if (decision === undefined) {
            throw new Error(`No VAR decision passed`);
        }

        switch (decision) {
            case 'penaltyAwarded':
                return 'penaltyCancelled';
            case 'penaltyNotAwarded':
                return 'penalty';
            case 'goalAwarded':
                return 'noGoal';
            case 'goalNotAwarded':
                return 'goal';
            case 'cardUpgrade':
                return 'yellowCardOverturned';
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