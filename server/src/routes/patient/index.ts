import { addCustomField } from '../customField/addCustomField';
import { addPatient } from './addPatient';
import { getPatients } from './getPatients';
import { removePatient } from './deletePatient';
import { updatePatient } from './updatePatient';

export const patientRoutes = [
  addPatient,
  getPatients,
  removePatient,
  updatePatient,
];
