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
import { AddCustomFieldForm } from "components/forms/addCustomFieldForm";

export default function AddCustomField() {
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
          Add Custom Field
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Custom Field</DialogTitle>
          <DialogDescription>Add a custom field</DialogDescription>
        </DialogHeader>
        <AddCustomFieldForm closeModal={closeModal} />
      </DialogContent>
    </Dialog>
  );
}
