import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Purchase } from "./purchase.entity";
import { UsersRole } from "src/enums/userRole.enum";
import { Chat } from "./chat.entity";
import { Message } from "./messages.entity";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn({ name: "user_id" })
  userId!: number;

  @Column({ name: "user_name" })
  userName!: string;

  @Column({ type: "text" })
  password?: string; // ? for cases when the sign in from google

  @Column({ type: "text" })
  email!: string;

  @Column({ type: "enum", enum: UsersRole, default: UsersRole.USER })
  role!: UsersRole;

  @Column()
  profile?: string;

  @OneToMany(() => Purchase, (purchase) => purchase.user)
  purchases?: Purchase[];

  @OneToMany(() => Chat, (chat) => chat.user)
  chats!: Chat[];

  @OneToMany(() => Message, (message) => message.sender)
  messages!: Message[];
}
