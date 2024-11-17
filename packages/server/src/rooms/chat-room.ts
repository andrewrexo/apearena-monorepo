import { Room, Client } from "@colyseus/core";
import { ChatRoomState, Message } from "./schema/chat-room-state";
import { sendConnectedStats } from "../lib/stats";

export class ChatRoom extends Room<ChatRoomState> {
  maxClients = 10;
  private readonly MAX_MESSAGES = 100;

  onCreate(options: any) {
    this.setState(new ChatRoomState());

    // Handle incoming chat messages
    this.onMessage("chat", (client, message: { content: string }) => {
      this.handleChatMessage(client, message);
    });
  }

  onJoin(client: Client, options: any) {
    // Broadcast join message
    this.broadcast(
      "system",
      {
        content: `${client.sessionId} joined the chat.`,
        sessionId: client.sessionId,
        timestamp: Date.now(),
      },
      { except: client }
    );

    sendConnectedStats(client);
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left chat!");

    this.broadcast(
      "system",
      {
        content: `${client.sessionId} left the chat.`,
        sessionId: client.sessionId,
        timestamp: Date.now(),
      },
      { except: client }
    );
  }

  private handleChatMessage(client: Client, message: { content: string }) {
    // Don't process empty messages
    if (!message.content?.trim()) {
      return;
    }

    // TODO: Validate message content, e.g. no bad words or other inappropriate content
    // Create new message instance
    const chatMessage = new Message();
    chatMessage.sessionId = client.sessionId;
    chatMessage.content = message.content;
    chatMessage.timestamp = Date.now();

    // Add to state
    this.state.messages.set(this.state.messageCount.toString(), chatMessage);
    this.state.messageCount++;

    // Prune old messages if we exceed MAX_MESSAGES
    if (this.state.messages.size > this.MAX_MESSAGES) {
      const oldestKey = [...this.state.messages.keys()][0];
      this.state.messages.delete(oldestKey);
    }
  }

  onDispose() {
    console.log("Chat room", this.roomId, "disposing...");
  }
}
