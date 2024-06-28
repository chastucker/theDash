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
import { AddPatientForm } from "components/forms/addPatientForm";

export default function AddPatient() {
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
          Add Patient
        </div>
      </DialogTrigger>
      <DialogContent className="overflow-scroll max-h-[50%]">
        <DialogHeader>
          <DialogTitle>Add Patient</DialogTitle>
          <DialogDescription>Add a patient to the group</DialogDescription>
        </DialogHeader>
        <AddPatientForm closeModal={closeModal} />
      </DialogContent>
    </Dialog>
  );
}
