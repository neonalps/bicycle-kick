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
    LowerLegFracture = "lowerLegFracture",
    Muscle = "muscle",
    PubicBone = "pubicBone",
    Shoulder = "shoulder",
    Thigh = "thigh",
    UpperLegFracture = "upperLegFracture",
    // suspension
    YellowCard = "yellowCard",
    YellowRedCard = "yellowRedCard",
    RedCard = "redCard",
}