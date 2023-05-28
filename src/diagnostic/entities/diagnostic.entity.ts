import {Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {IDiagnostic} from "../interfaces/IDiagnostic";
import {PatientPropertyEntity} from "../../patient-property/entities/patient.property.entity";

@Entity('diagnostics')
export class DiagnosticEntity implements IDiagnostic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  mkbCode: string;

  @Column()
  name: string;

  @ManyToMany(() => PatientPropertyEntity)
  @JoinTable({
    name: 'patient2diagnostics'
  })
  patient: PatientPropertyEntity[];
}