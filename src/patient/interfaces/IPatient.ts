import {TSex} from "../types/TSex";
import {IPatientProperty, IPatientPropertyCreate} from "../../patient-property/interfaces/IPatientProperty";

export interface IPatient {
  id: number;
  sex: TSex;
  birth: string;
  patientId: number;
  property?: IPatientPropertyCreate[]
}