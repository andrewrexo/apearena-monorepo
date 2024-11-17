import { matchMaker } from "@colyseus/core";
import type { Client } from "colyseus";

const getConnectedStats = async () => {
  return matchMaker.stats.getGlobalCCU();
};

export const sendConnectedStats = async (client: Client) => {
  const stats = await getConnectedStats();
  if (stats !== undefined && stats !== null) {
    // doesn't include the client that sent the message, so we add +1
    client.send("world:stats", stats + 1);
  }

  console.log(client.sessionId, "sending connected stats");
};
