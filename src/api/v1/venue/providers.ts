import { RouteProvider } from "@src/router/types";
import { ApplicationServices } from "@src/di/services";
import { UpdateVenueByIdRouteHandler } from "./update-by-id/handler";
import { UpdateVenueByIdRouteProvider } from "./update-by-id/route-provider";
import { CreateVenueRouteHandler } from "./create/handler";
import { GetVenueByIdRouteHandler } from "./get-by-id/handler";
import { CreateVenueRouteProvider } from "./create/route-provider";
import { GetVenueByIdRouteProvider } from "./get-by-id/route-provider";

export function getVenueRouteProviders(services: ApplicationServices): RouteProvider<any, any>[] {

    const createVenueHandler = new CreateVenueRouteHandler(services.apiHelperService, services.venueService);
    const getVenueByIdHandler = new GetVenueByIdRouteHandler(services.apiHelperService, services.venueService);
    const updateVenueByIdHandler = new UpdateVenueByIdRouteHandler(services.apiHelperService, services.venueService);

    return [
        new CreateVenueRouteProvider(createVenueHandler),
        new GetVenueByIdRouteProvider(getVenueByIdHandler),
        new UpdateVenueByIdRouteProvider(updateVenueByIdHandler),
    ];

}