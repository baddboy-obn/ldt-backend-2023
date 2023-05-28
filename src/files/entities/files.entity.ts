import {IFiles} from "../interfaces/IFiles";
import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity('files')
export class FilesEntity implements IFiles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileName: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

}