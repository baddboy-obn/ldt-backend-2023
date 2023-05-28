import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('mkb-category')
export class MkbCategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mkbCode: string;

  @Column()
  name: string;
}