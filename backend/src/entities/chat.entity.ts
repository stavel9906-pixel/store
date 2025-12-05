import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { User } from "./user.entity";
import { Message } from "./messages.entity";

@Entity({ schema: "shop", name: "chats" })
export class Chat {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.chats, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ default: true, name: "is_open" })
  isOpen!: boolean;

  @OneToMany(() => Message, (message) => message.chat, { cascade: true })
  messages!: Message[];
}
