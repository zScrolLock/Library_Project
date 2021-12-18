import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("reserved")
export default class Reserved {

    @PrimaryColumn()
    user_id: string

    @PrimaryColumn()
    book_id: number

    @PrimaryColumn()
    createdAt: Date;

    @Column()
    devolution: Date
}