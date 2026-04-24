export enum GameAbsenceType {
    AtRisk = "atRisk",
    Exempt = "exempt",
    Injured = "injured",
    Suspended = "suspended",
}

export enum GameAbsenceReason {
    // exempt
    Private = "private",
    // injury
    // TODO add here
    // suspension
    YellowCard = "yellowCard",
    RedCard = "redCard",
}