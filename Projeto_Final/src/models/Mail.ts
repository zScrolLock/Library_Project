import { Column, Entity, PrimaryColumn, CreateDateColumn} from "typeorm";

@Entity("mail")
export default class Mail {

    @PrimaryColumn()
    user_id: string

    @PrimaryColumn()
    createdAt: Date;

    @Column()
    title: string

    @Column()
    about: string

    @Column()
    message: string
}