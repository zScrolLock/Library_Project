import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Book from "./Book";

@Entity("images")
export default class Images {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  path: string;

  @ManyToOne(() => Book, book => book.images)
  @JoinColumn({ name: "book_id"})
  book: Book;

}