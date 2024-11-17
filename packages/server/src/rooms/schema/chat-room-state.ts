import { Schema, type, MapSchema } from "@colyseus/schema";

// Message schema to store individual chat messages
export class Message extends Schema {
  @type("string") sessionId: string;
  @type("string") content: string;
  @type("number") timestamp: number;
}

// Main chat room state
export class ChatRoomState extends Schema {
  @type({ map: Message }) messages = new MapSchema<Message>();
  @type("number") messageCount = 0;
}
