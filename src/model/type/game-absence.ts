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
    Back = "back",
    BrokenFoot = "brokenFoot",
    CruciaLigament = "cruciateLigamentRupture",
    Muscle = "muscle",
    PubicBone = "pubicBone",
    Shoulder = "shoulder",
    Thigh = "thigh",
    // suspension
    YellowCard = "yellowCard",
    YellowRedCard = "yellowRedCard",
    RedCard = "redCard",
}