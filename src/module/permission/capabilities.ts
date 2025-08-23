import { Capability } from "@src/model/internal/capabilities";
import { AccountRole } from "@src/model/type/account-role";

const substituteCapabilities: ReadonlyArray<Capability> = [
    Capability.ReadClub,
    Capability.ReadGame,
    Capability.ReadPerson,
    Capability.ReadSeason,
    Capability.ReadStats,
];

const playerCapabilities: ReadonlyArray<Capability> = [
    ...substituteCapabilities,
    // add player role specific capabilities here
];

const managerCapabilities: ReadonlyArray<Capability> = [
    ...playerCapabilities,
    // add manager role specific capabilities here
    Capability.ReadUser,
    Capability.WriteUser,
];


export function provideRoleToCapabilities(): Record<AccountRole, ReadonlyArray<Capability>> {
    return {
        substitute: substituteCapabilities,
        player: playerCapabilities,
        manager: managerCapabilities,
    };
}