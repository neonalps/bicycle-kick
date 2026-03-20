export enum Capability {
    // account
    ReadAccount = "account.read",
    WriteAccount = "account.write",
    // club
    ReadClub = "club.read",
    WriteClub = "club.write",
    // game
    ImportGame = "game.import",
    ReadGame = "game.read",
    WriteGame = "game.write",
    // person
    ReadPerson = "person.read",
    WritePerson = "person.write",
    // season
    ReadSeason = "season.read",
    WriteSeason = "season.write",
    // stats
    ReadStats = "stats.read",
    // venue
    ReadVenue = "venue.read",
    WriteVenue = "venue.write",
    // application
    ReadApplicationStats = "applicationStats.read",
}