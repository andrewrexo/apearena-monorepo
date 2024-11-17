import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import { ChatRoom } from "./rooms/chat-room";

export default config({
  initializeGameServer: (gameServer) => {
    gameServer.define("chat", ChatRoom);
  },

  initializeExpress: (app) => {
    if (process.env.NODE_ENV !== "production") {
      app.use("/", playground);
      app.use("/colyseus", monitor());
    }
  },

  beforeListen: () => {
    /**
     * Before before gameServer.listen() is called.
     */
  },
});
