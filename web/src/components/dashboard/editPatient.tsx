"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "components/ui/dialog";
import { AddEditPatientForm } from "components/forms/addEditPatient";
import {
  GetGetPatients200CustomFieldsItem,
  GetGetPatients200PatientsItem,
} from "generated_client";

export default function EditPatient({
  patient,
  open,
  closeModal,
  customFields,
}: {
  patient: GetGetPatients200PatientsItem | undefined;
  open: boolean;
  closeModal: () => void;
  customFields: GetGetPatients200CustomFieldsItem[];
}) {
  return (
    <Dialog open={open}>
      <DialogContent
        closeModal={closeModal}
        className="overflow-scroll max-h-[50%]"
      >
        <DialogHeader>
          <DialogTitle>Edit Patient</DialogTitle>
          <DialogDescription>Edit a patient to the group</DialogDescription>
        </DialogHeader>
        <AddEditPatientForm
          patient={patient}
          customFields={customFields}
          closeModal={closeModal}
        />
      </DialogContent>
    </Dialog>
  );
}
