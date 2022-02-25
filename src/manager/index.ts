import { router as clusterRouter, clusters } from "./clusters";
import { ClusterData } from "../@types/cluster";
import { ManagerStatus } from "../@types/manager";
import config from "../config";
import { connection } from "../database";
import express from "express";
import { expressLogger } from "../utils/logger/express";
import { inspect } from "util";
import { managerLogger } from "../utils/logger/manager";
import {redis} from "../redis";


const app = express();
app.use(expressLogger);

// routes
app.use("/cluster", clusterRouter);

// main route
app.get("/", (_req, res) => {
  const list: Array<ClusterData> = Array.from(clusters.values());
  res.json({
    clusters: list,
    totalShards: list.reduce((acc, cluster) => acc + cluster.shards.length, 0),
    totalGuilds: list.map(c => c.guilds).reduce((a, b) => a + b, 0),
    totalUsers: list.map(c => c.users).reduce((a, b) => a + b, 0),
    totalMemory: list.reduce((acc, cluster) => acc + cluster.memory, 0) + process.memoryUsage().heapUsed,
    lastUpdate: Date.now(),
  } as ManagerStatus);
});

app.get("/redis", async (req, res) => {
  await redis.publish("test", Math.random().toString());
  res.status(200).send("OK");
})

if (config.apiPort) app.listen(config.apiPort, () => managerLogger.info(`Webserver listening on port ${config.apiPort}.`));
else throw new Error("Manager has no port to listen to.");

connection.then(() => managerLogger.info("Connected to database."));

process.on("unhandledRejection", error => managerLogger.error(`Unhandled rejection: ${inspect(error)}`));
