/**
 * Generated by orval v6.30.2 🍺
 * Do not edit manually.
 * The Dash Backend
 * The Dash Backend API
 * OpenAPI spec version: 0.0.1
 */
import type { GetGetPatients200ItemAddressesItem } from "./getGetPatients200ItemAddressesItem";
import type { GetGetPatients200ItemPatientCustomFieldsItem } from "./getGetPatients200ItemPatientCustomFieldsItem";

export type GetGetPatients200Item = {
  addresses: GetGetPatients200ItemAddressesItem[];
  dateOfBirth: string;
  firstName: string;
  id: string;
  lastName: string;
  middleName?: string;
  patientCustomFields: GetGetPatients200ItemPatientCustomFieldsItem[];
  status: string;
};
