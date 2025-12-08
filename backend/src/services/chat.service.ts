import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Chat } from "src/entities/chat.entity";
import { Message } from "src/entities/messages.entity";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private chatRepo: Repository<Chat>,
    @InjectRepository(Message) private messageRepo: Repository<Message>,
    @InjectRepository(User) private userRepo: Repository<User>
  ) {}

  async createChat(userId: number): Promise<Chat> {
    let chat = await this.chatRepo.findOne({
      where: { user: { userId: userId }, isOpen: true },
      relations: ["user", "messages", "messages.sender"],
    });

    if (chat) return chat; 

    const user = await this.userRepo.findOne({ where: { userId: userId } });
    if (!user) throw new NotFoundException("User not found");

    chat = this.chatRepo.create({ user, isOpen: true });
    return this.chatRepo.save(chat);
  }

  async getChatById(chatId: number): Promise<Chat> {
    const chat = await this.chatRepo.findOne({
      where: { id: chatId },
      relations: ["user", "messages", "messages.sender"],
    });
    if (!chat) throw new NotFoundException("Chat not found");
    return chat;
  }

  async getOpenChats(): Promise<Chat[]> {
    return this.chatRepo.find({
      where: { isOpen: true },
      relations: ["user", "messages", "messages.sender"],
    });
  }

  async getMessagesByChat(chatId: number): Promise<Message[]> {
    const messages = await this.messageRepo.find({
      where: { chat: { id: chatId } },
      relations: ["sender", "chat"], 
      order: { timestamp: "ASC" },
    });

    return messages;
  }

  async createMessage(
    chatId: number,
    senderId: number,
    text: string
  ): Promise<Message> {
    const chat = await this.getChatById(chatId);
    const sender = await this.userRepo.findOne({ where: { userId: senderId } });
    // if (!sender) throw new NotFoundException("Sender not found");  not used in chance that it is first message 

    const message = this.messageRepo.create({
      chat,
      sender,
      text,
    });

    return this.messageRepo.save(message);
  }

  async closeChat(chatId: number): Promise<Chat> {
    const chat = await this.getChatById(chatId);
    chat.isOpen = false;
    return this.chatRepo.save(chat);
  }

  async getChatsForUser(userId: number): Promise<Chat | null> {
    return this.chatRepo.findOne({
      where: { user: { userId }, isOpen: true },
      relations: ["user", "messages", "messages.sender"],
      order: { id: "ASC" },
    });
  }
}
