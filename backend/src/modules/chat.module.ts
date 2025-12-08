import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "src/services/chat.service";
import { Chat } from "src/entities/chat.entity";
import { Message } from "src/entities/messages.entity";
import { User } from "src/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Message, User])],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
