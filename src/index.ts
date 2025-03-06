import fastify from "fastify";
import { getCorsConfig, getNodeEnv, getServerHost, getServerPort } from "@src/config";
import logger from "@src/log";
import { DependencyHelper } from "@src/di/helper";
import { RouteManager } from "@src/router/manager";
import { CorsManager } from "@src/cors/manager";
import { getRouteProviders } from "./api/providers";

const start = async () =>  {
  const server = fastify();
  
  DependencyHelper.initDependencies();
  RouteManager.registerRoutes(server, getRouteProviders());
  await CorsManager.registerCorsConfig(server, getCorsConfig());

  server.listen({ host: getServerHost(), port: getServerPort() }, async (err, address) => {
    if (err) {
      logger.error(err);
      process.exit(1);
    }
    logger.info(`Server listening at ${address}, environment: ${getNodeEnv()}`);
  });
};

start();