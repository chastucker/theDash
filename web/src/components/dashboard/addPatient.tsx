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
import { GetGetPatients200CustomFieldsItem } from "generated_client";

export default function AddPatient({
  customFields,
  open,
  closeModal,
}: {
  customFields: GetGetPatients200CustomFieldsItem[];
  open: boolean;
  closeModal: () => void;
}) {
  return (
    <Dialog open={open}>
      <DialogContent
        closeModal={closeModal}
        className="overflow-scroll max-h-[50%]"
      >
        <DialogHeader>
          <DialogTitle>Add Patient</DialogTitle>
          <DialogDescription>Add a patient to the group</DialogDescription>
        </DialogHeader>
        <AddEditPatientForm
          customFields={customFields}
          closeModal={closeModal}
        />
      </DialogContent>
    </Dialog>
  );
}
