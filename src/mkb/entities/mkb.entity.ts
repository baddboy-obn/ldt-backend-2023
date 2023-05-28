import {IMkb} from "../interfaces/IMkb";
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {TMkb} from "../types/TMkb";

@Entity('mkb')
export class MkbEntity implements IMkb {
  @PrimaryGeneratedColumn()
  id: IMkb['id'];

  @Column({ nullable: true })
  recommendation: string;

  @Column({ type: "float", nullable: true })
  del_freq: number;

  @Column({ type: 'float', nullable: true})
  use_freq: number

  @Column()
  mkb_code: string

  @Column({ enum: TMkb, type: 'enum', default: TMkb.pr})
  type: TMkb;
}