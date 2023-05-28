import {IPatient} from "../interfaces/IPatient";
import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {TSex} from "../types/TSex";
import {PatientPropertyEntity} from "../../patient-property/entities/patient.property.entity";

@Entity('patient')
export class PatientEntity implements IPatient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patientId: number;

  @Column({ enum: TSex, type: 'enum'})
  sex: TSex;

  @Column()
  birth: string;

  @OneToMany(() => PatientPropertyEntity, item => item.patient, {
    cascade: true
  })
  property: PatientPropertyEntity[]

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}