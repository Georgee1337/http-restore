import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'User' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, name: 'discord_id' })
    discord_id: string;

    @Column({ unique: true, name: 'refresh_token' })
    refresh_token: string;

    @Column({ name: 'access_token' })
    access_token: string;
}