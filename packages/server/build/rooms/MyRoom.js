"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyRoom = void 0;
const core_1 = require("@colyseus/core");
const MyRoomState_1 = require("./schema/MyRoomState");
class MyRoom extends core_1.Room {
    constructor() {
        super(...arguments);
        this.maxClients = 10;
    }
    onCreate(options) {
        this.setState(new MyRoomState_1.MyRoomState());
        //this.onMessage("stats", async (client, message) => {});
    }
    onJoin(client, options) {
        console.log(client.sessionId, "joined!");
        const sendConnectedStats = async () => {
            const stats = await core_1.matchMaker.stats.getGlobalCCU();
            if (stats !== undefined && stats !== null) {
                // doesn't include the client that sent the message, so we add +1
                client.send("world:stats", stats + 1);
            }
        };
        sendConnectedStats();
    }
    onLeave(client, consented) {
        console.log(client.sessionId, "left!");
    }
    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }
}
exports.MyRoom = MyRoom;
