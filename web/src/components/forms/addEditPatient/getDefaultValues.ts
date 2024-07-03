import {
  GetGetPatients200CustomFieldsItem,
  GetGetPatients200PatientsItem,
} from "generated_client";
import { formSchema } from "./constants";
import { z } from "zod";

export function getDefaultValues(
  patient: GetGetPatients200PatientsItem | undefined,
  customFields: GetGetPatients200CustomFieldsItem[]
) {
  const defaultValues: z.infer<typeof formSchema> = {
    firstName: patient?.firstName ?? "",
    middleName: patient?.middleName ?? "",
    lastName: patient?.lastName ?? "",
    dateOfBirth: patient?.dateOfBirth
      ? new Date(patient.dateOfBirth)
      : new Date(),
    status: patient?.status ?? "",
    addresses: patient?.addresses ?? [
      {
        street: "",
        city: "",
        state: "",
        zip: "",
      },
    ],
    customFields: [],
  };

  if (!patient) {
    for (const field of customFields) {
      if (field.type === "date") {
        const date =
          field.defaultValue &&
          new Date(field.defaultValue) instanceof Date &&
          !isNaN(new Date(field.defaultValue).getTime())
            ? new Date(field.defaultValue)
            : new Date();

        defaultValues.customFields.push({
          customFieldId: field.id,
          customFieldName: field.name,
          value: date.toISOString(),
        });
        continue;
      }

      defaultValues.customFields.push({
        customFieldId: field.id,
        customFieldName: field.name,
        value: field.defaultValue ?? "",
      });
    }
  } else {
    patient.patientCustomFields.forEach((field) => {
      const customField = customFields.find(
        (cf) => cf.id === field.customFieldId
      );

      if (customField && customField.type === "date") {
        const date =
          field.value &&
          new Date(field.value) instanceof Date &&
          !isNaN(new Date(field.value).getTime())
            ? new Date(field.value)
            : new Date();

        defaultValues.customFields.push({
          customFieldId: customField.id,
          customFieldName: customField.name,
          value: date.toString(),
        });
      } else {
        if (customField) {
          defaultValues.customFields.push({
            customFieldId: customField.id,
            customFieldName: customField.name,
            value: field.value ?? "",
          });
        }
      }
    });
  }

  return defaultValues;
}
