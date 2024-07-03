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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modify Custom Field</DialogTitle>
          <DialogDescription>Add or Edit a custom field</DialogDescription>
        </DialogHeader>
        <AddEditCustomFieldForm
          customFields={customFields ?? []}
          closeModal={closeModal}
        />
      </DialogContent>
    </Dialog>
  );
}
