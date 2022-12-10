import { Exclude } from 'class-transformer';
import { GenderEnum } from './../../../../enums/gender.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  firstname: string;

  @Column({ nullable: true })
  lastname: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({
    type: 'enum',
    name: 'gender',
    enum: GenderEnum,
    nullable: true,
  })
  gender: GenderEnum;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  profile_image: string;

  @Column({ nullable: true })
  cover_image: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  success_story: string;

  @Column({ nullable: true })
  skills: string;

  @Column({ nullable: true })
  facebook_url: string;

  @Column({ nullable: true })
  twitter_url: string;

  @Column({ nullable: true })
  instagram_url: string;

  @Column({ nullable: true })
  linkdln_url: string;

  @Column({ nullable: true })
  website_url: string;

  @Column({ default: false })
  is_top_member: boolean;

  @Column({ nullable: true })
  experience_year_count: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
