import { FilterProvider } from "@src/module/advanced-query/provider/base";
import { FilterDescriptor } from "@src/module/advanced-query/filter/descriptor";
import { ParameterName } from "@src/module/advanced-query/scenario/constants";
import { extractNumberComparison } from "@src/module/advanced-query/helper";
import { TeamPlayerSentOffFilter } from "@src/module/advanced-query/filter/team-player-sent-off";

export class TeamPlayerSentOffFilterProvider implements FilterProvider<TeamPlayerSentOffFilter> {

    provide(descriptor: FilterDescriptor): TeamPlayerSentOffFilter {
        const numberComparison = extractNumberComparison(descriptor);
        if (numberComparison === null) {
            throw new Error(`Missing mandatory number comparison parameter`);
        }

        const mainParameter = descriptor.parameters.find(parameter => parameter.name === ParameterName.Main);
        if (mainParameter !== undefined) {
            return new TeamPlayerSentOffFilter({ main: Number(mainParameter.value[0]), ...numberComparison });
        }

        const opponentParameter = descriptor.parameters.find(parameter => parameter.name === ParameterName.Opponent);
        if (opponentParameter !== undefined) {
            return new TeamPlayerSentOffFilter({ opponent: Number(opponentParameter.value[0]), ...numberComparison });
        }

        const totalParameter = descriptor.parameters.find(parameter => parameter.name === ParameterName.Total);
        if (totalParameter !== undefined) {
            return new TeamPlayerSentOffFilter({ total: Number(totalParameter.value[0]), ...numberComparison });
        }

        throw new Error(`Missing one mandatory parameter of: ${[ParameterName.Main, ParameterName.Opponent, ParameterName.Total].join(", ")}`)
    }

}