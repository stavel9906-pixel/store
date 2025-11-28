import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Purchase } from "./purchase.entity";
import { UsersRole } from "src/enums/userRole.enum";

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

  @OneToMany(() => Purchase, (purchase) => purchase.user)
  purchases?: Purchase[];

  @Column({ nullable: true })
  phone: string;

  @Column({ name: "first_name" })
  firstName: string;

  @Column({ name: "last_name" })
  lastName: string;
}
