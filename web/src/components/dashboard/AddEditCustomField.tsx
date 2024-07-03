"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import { AddEditCustomFieldForm } from "components/forms/AddEditCustomFieldForm";
import { GetGetPatients200CustomFieldsItem } from "generated_client";

export default function AddEditCustomField({
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
      <DialogContent closeModal={closeModal}>
        <DialogHeader>
          <DialogTitle>Modify Column</DialogTitle>
          <DialogDescription>Add or edit a column</DialogDescription>
        </DialogHeader>
        <AddEditCustomFieldForm
          customFields={customFields ?? []}
          closeModal={closeModal}
        />
      </DialogContent>
    </Dialog>
  );
}
