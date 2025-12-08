import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "src/services/chat.service";

@WebSocketGateway({
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5173/chat"],
    methods: ["GET", "POST"],
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage("sendMessage")
  async handleMessage(
    @MessageBody() payload: { chatId: number; senderId: number; text: string }
  ) {
    const msg = await this.chatService.createMessage(
      payload.chatId,
      payload.senderId,
      payload.text
    );

    this.server.to(`chat_${payload.chatId}`).emit("newMessage", msg);
  }

  @SubscribeMessage("joinChat")
  async handleJoinChat(
    @MessageBody() chatId: number,
    @ConnectedSocket() client: Socket
  ) {
    client.join(`chat_${chatId}`);
    const history = await this.chatService.getMessagesByChat(chatId);
    client.emit("history", history);
  }

  @SubscribeMessage("openChat")
  async handleOpenChat(
    @MessageBody() userId: number,
    @ConnectedSocket() client: Socket
  ) {
    const chat = await this.chatService.createChat(userId);

    client.emit("chatOpened", chat); // למשתמש
    this.server.emit("newChatForAdmin", chat); // לאדמין

    return chat;
  }

  @SubscribeMessage("getOpenChats")
  async getOpenChats(@ConnectedSocket() client: Socket) {
    const chat = await this.chatService.getOpenChats();
    client.emit("openChatsForAdmin", chat);
  }

  @SubscribeMessage("getOpenChatForUser")
  async getUserChat(
    @MessageBody() userId: number,
    @ConnectedSocket() client: Socket
  ) {
    const chat = await this.chatService.getChatsForUser(userId);
    client.emit("getOpenChatForUser", chat);
  }

  @SubscribeMessage("closeChat")
  async handleCloseChat(@MessageBody() chatId: number) {
    const closedChat = await this.chatService.closeChat(chatId);

    this.server.to(`chat_${chatId}`).emit("chatClosed", closedChat);
    this.server.emit("chatClosedForAdmin", closedChat);

    return closedChat;
  }
}
