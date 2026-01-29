import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('magic_link_tokens')
export class MagicLinkToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  token: string;

  @Column()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    type?: 'team_invitation' | 'tiktok_authorize' | string;
    managerId?: number;
    managerEmail?: string;
    storesCount?: number;
    redirectUrl?: string;
    [key: string]: any;
  } | null;
}
