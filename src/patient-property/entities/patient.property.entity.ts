import {IPatientProperty} from "../interfaces/IPatientProperty";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn, JoinTable, ManyToMany,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import {PatientEntity} from "../../patient/entities/patient.entity";
import {DiagnosticEntity} from "../../diagnostic/entities/diagnostic.entity";

@Entity('property')
export class PatientPropertyEntity implements IPatientProperty {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  diagnose: string;

  @Column()
  diagnosticDate: string;

  @Column()
  doctorProfession: string;

  @ManyToOne(() => PatientEntity, item => item.id)
  @JoinColumn()
  patient: PatientEntity;

  @ManyToMany(() => DiagnosticEntity, {
    cascade: true,
    nullable: true
  })
  @JoinTable({
    name: 'patient2diagnostics'
  })
  diagnostic: DiagnosticEntity[]

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}