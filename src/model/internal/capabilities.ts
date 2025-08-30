export enum Capability {
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
    // management: user
    ReadUser = "user.read",
    WriteUser = "user.write",
}