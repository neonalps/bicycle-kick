import { RouteProvider } from "@src/router/types";
import { getSearchRouteProviders } from "./v1/search/providers";

export function getRouteProviders(): RouteProvider<any, any>[] {

    return [
        ...getSearchRouteProviders(),
    ];
    
}