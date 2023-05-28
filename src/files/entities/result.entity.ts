import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('result')
export class ResultEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "jsonb"})
  result: string;
}