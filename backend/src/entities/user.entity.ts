import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Purchase } from './purchase.entity';
import { UsersRole } from 'src/enums/userRole.enum';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  userId!: number;

  @Column({ type: 'text' })
  userName!: string;

  @Column({ type: 'text', nullable: true })
  password!: string;

  @Column({ type: 'text', nullable: true })
  email!: string;

  @Column({ type: 'enum', enum: UsersRole, default: UsersRole.USER })
  role!: UsersRole;

  @OneToMany(() => Purchase, (purchase) => purchase.user)
  purchases?: Purchase[];
}
