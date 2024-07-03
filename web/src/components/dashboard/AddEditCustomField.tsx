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
}: {
  customFields: GetGetPatients200CustomFieldsItem[];
}) {
  const [open, setOpen] = useState(false);

  const closeModal = () => {
    setOpen(false);
  };

  const openModal = () => {
    setOpen(true);
  };

  return (
    <Dialog open={open}>
      <DialogTrigger onClick={openModal}>
        <div className="border p-2 m-2 bg-black text-white rounded-xl">
          Modify Custom Fields
        </div>
      </DialogTrigger>
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
