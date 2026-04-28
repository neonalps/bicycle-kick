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
    Ankle = "ankle",
    CruciaLigament = "cruciateLigamentRupture",
    Muscle = "muscle",
    // suspension
    YellowCard = "yellowCard",
    RedCard = "redCard",
}