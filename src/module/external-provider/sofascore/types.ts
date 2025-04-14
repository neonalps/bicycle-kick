interface Tournament {
    id: number;
    name: string;
    uniqueTournament: {
        id: number;
        name: string;
    },
    isGroup: boolean;
}

interface Season {
    id: number;
    name: string;
    year: string;
}

interface Round {
    round: string;
}

interface Venue {
    id: number;
    city: {
        name: string;
    },
    venueCoordinates: {
        latitude: number;
        longitude: number;
    },
    hidden: boolean;
    name: string;
    capacity: number;
    stadium: {
        name: string;
        capacity: number;
    }
}

interface Team {
    name: string;
    shortName: string;
    fullName: string;
    teamColors: {
        primary: string;
        secondary: string;
        text: string;
    }
}

interface Referee {
    id: number;
    name: string;
}

interface Score {
    current: number;
    display: number;
    period1: number;
    period2: number;
    normaltime: number;
}

interface InjuryTime {
    injuryTime1: number;
    injuryTime2: number;
}

interface Event {
    id: number;
    tournament: Tournament;
    season: Season;
    roundInfo: Round;
    customId: string;
    winnerCode: number;
    venue: Venue;
    referee: Referee;
    homeTeam: Team;
    awayTeam: Team;
    homeScore: Score;
    awayScore: Score;
    time: InjuryTime;
    startTimestamp: number;
}

interface TeamLineup {
    players: LineupPlayer[];
    formation: string;
    playerColor: ShirtColor;
}

interface LineupPlayer {
    player: GamePlayer;
    teamId: number;
    shirtNumber: number;
    jerseyNumber: string;
    position: string;
    substitute: boolean;
    captain: boolean;
    statistics: {
        minutesPlayed: number;
    }
}

interface GamePlayer {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    position: string;
    jerseyNumber: string;
}

interface Incident {
    id: number;
    time: number;
    isHome?: boolean;
    incidentType: string;
    incidentClass?: string;
    homeScore?: number;
    awayScore?: number;
    player?: GamePlayer;
    playerIn?: GamePlayer;
    playerOut?: GamePlayer;
    assist1?: GamePlayer;
    rescinded?: boolean;
    reason?: string;
}

interface Manager {
    id: number;
    name: string;
}

interface ShirtColor {
    primary: string;
    number: string;
    outline: string;
    fancyNumber: string;
}

export interface SofascoreGameDto {
    event: Event;
    incidents: Incident[];
    home: TeamLineup;
    away: TeamLineup;
    homeManager: Manager;
    awayManager: Manager;
}