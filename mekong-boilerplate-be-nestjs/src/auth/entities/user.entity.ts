import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OAuthAccount } from './oauth-account.entity';
import { RefreshToken } from './refresh-token.entity';
import { UserRole } from '../enums/user-role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    transformer: {
      to: (value: string) => value?.toLowerCase().trim(),
      from: (value: string) => value
    }
  })
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  image: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.MEMBER,
  })
  role: UserRole;

  @OneToMany(() => OAuthAccount, (account) => account.user)
  oauthAccounts: OAuthAccount[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
