import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Images from "./Images";

export enum statusBook {
    AVAILABLE = "AVAILABLE",
    UNAVAILABLE = "UNAVAILABLE",
    PENDING = "PENDING"
}

@Entity("book")
export default class Book {

    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    author: string;

    @Column()
    pages: number;

    @Column({
        type: "enum",
        "enum": statusBook,
        default: statusBook.AVAILABLE
    })
    status: statusBook

    @Column()
    quantity: number;

    @OneToMany(type => Images, (image) => image.book, {
        cascade: ["insert", "update", "remove"]
      })
      images: Images[]
}