import { Capability } from "@src/model/internal/capabilities";
import { AccountRole } from "@src/model/type/account-role";

const substituteCapabilities: ReadonlyArray<Capability> = [
    Capability.ReadClub,
    Capability.ReadGame,
    Capability.ReadPerson,
    Capability.ReadSeason,
    Capability.ReadStats,
    Capability.ReadVenue,
];

const playerCapabilities: ReadonlyArray<Capability> = [
    ...substituteCapabilities,
    // add player role specific capabilities here
];

const managerCapabilities: ReadonlyArray<Capability> = [
    ...playerCapabilities,
    // add manager role specific capabilities here
    Capability.ImportGame,
    Capability.ReadUser,
    Capability.WriteClub,
    Capability.WriteGame,
    Capability.WritePerson,
    Capability.WriteUser,
    Capability.WriteVenue,
    Capability.ReadApplicationStats,
];


export function provideRoleToCapabilities(): Record<AccountRole, ReadonlyArray<Capability>> {
    return {
        substitute: substituteCapabilities,
        player: playerCapabilities,
        manager: managerCapabilities,
    };
}