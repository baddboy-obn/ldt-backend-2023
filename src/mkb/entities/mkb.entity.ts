import {IMkb} from "../interfaces/IMkb";
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {TMkb} from "../types/TMkb";

@Entity('mkb')
export class MkbEntity implements IMkb {
  @PrimaryGeneratedColumn()
  id: IMkb['id'];

  @Column()
  recommendation: string;

  @Column({ type: "float" })
  del_freq: number;

  @Column({ type: 'float'})
  use_freq: number

  @Column()
  mkb_code: string

  @Column({ enum: TMkb, type: 'enum'})
  type: TMkb;
}