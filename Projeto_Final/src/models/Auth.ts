import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, JoinTable } from "typeorm";
import Book from "./Book";

export enum userRole {
    NORMAL = "NORMAL",
    EMPLOYEE = "EMPLOYEE"
}

@Entity("user")
export default class User {
    
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    email: string

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @ManyToMany(() => Book)
    @JoinTable()
    favorites: Book[]

    @Column({
        type: "enum",
        "enum": userRole,
        default: userRole.NORMAL
    })
    role: userRole;

    @Column()
    name: string

    @CreateDateColumn({
        type: "timestamp",
        default: () => 'CURRENT_TIMESTAMP(6) '
    })
    createdAt: Date;
}