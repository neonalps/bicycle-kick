import fastify from "fastify";
import { getAuthTokenConfig, getCorsConfig, getNodeEnv, getServerHost, getServerPort } from "@src/config";
import logger from "@src/log";
import { DependencyManager } from "@src/di/manager";
import { RouteManager } from "@src/router/manager";
import { CorsManager } from "@src/cors/manager";
import { getRouteProviders } from "./api/providers";
import { initAndTestDatabaseConnection } from "./db";

const start = async () =>  {
  const server = fastify();
  
  await initAndTestDatabaseConnection();

  const applicationServices = new DependencyManager().getServices();
  const authTokenConfig = getAuthTokenConfig();
  RouteManager.registerJwtParser(server, authTokenConfig.signingKey, authTokenConfig.issuer, authTokenConfig.audience);
  RouteManager.registerRoutes(server, getRouteProviders(applicationServices), { accountService: applicationServices.accountService, permissionService: applicationServices.permissionService });
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