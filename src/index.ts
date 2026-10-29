import fastify from "fastify";
import { DependencyManager } from "@src/di/manager";
import { RouteManager } from "@src/router/manager";
import { CorsManager } from "@src/cors/manager";
import { getRouteProviders } from "./api/providers";
import { ApplicationConfigManager } from "./config/manager";
import { DatabaseManager } from "./db/manager";
import { LogManager } from "./log/manager";

const start = async () =>  {
  const server = fastify();

  const logger = new LogManager().getInstance();

  const applicationConfig = new ApplicationConfigManager().read();
  
  const dbManager = new DatabaseManager(applicationConfig.dbConnectionUrl);
  const applicationServices = new DependencyManager(applicationConfig, dbManager.requireInstance()).getServices();
  const authTokenConfig = applicationConfig.authTokenConfig;
  RouteManager.registerJwtParser(server, authTokenConfig.signingKey, authTokenConfig.issuer, authTokenConfig.audience);
  await RouteManager.registerFormMultipart(server);
  RouteManager.registerRoutes(server, getRouteProviders(applicationServices, applicationConfig), { accountService: applicationServices.accountService, permissionService: applicationServices.permissionService });
  await CorsManager.registerCorsConfig(server, applicationConfig.corsConfig);

  try {
    const address = await server.listen({ host: applicationConfig.serverHost, port: applicationConfig.serverPort });
    logger.info(`Server listening at ${address}, environment: ${applicationConfig.nodeEnv}`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

start();