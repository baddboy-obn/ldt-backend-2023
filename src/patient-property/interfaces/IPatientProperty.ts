export interface IPatientProperty {
  id: number;
  doctorProfession: string;
  diagnose: string;
  diagnosticDate: string;
}

export interface IPatientPropertyCreate extends Omit<IPatientProperty, 'id'>{

}