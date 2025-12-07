import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Chat } from "./chat.entity";

@Entity({ schema: "shop", name: "messages" })
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Chat, (chat) => chat.messages)
  @JoinColumn({ name: "chat_id" })
  chat: Chat;

  @ManyToOne(() => User, (user) => user.messages)
  @JoinColumn({ name: "sender_id" })
  sender: User | null;

  @Column("text")
  text: string;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  timestamp: Date;
}
