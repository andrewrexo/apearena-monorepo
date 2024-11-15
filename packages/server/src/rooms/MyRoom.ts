import { Room, Client, matchMaker } from "@colyseus/core";
import { MyRoomState } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {
  maxClients = 10;

  onCreate(options: any) {
    this.setState(new MyRoomState());

    //this.onMessage("stats", async (client, message) => {});
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");

    const sendConnectedStats = async () => {
      const stats = await matchMaker.stats.getGlobalCCU();

      if (stats !== undefined && stats !== null) {
        // doesn't include the client that sent the message, so we add +1
        client.send("world:stats", stats + 1);
      }
    };

    sendConnectedStats();
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
