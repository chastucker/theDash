import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";

export default function Modal({
  title,
  description,
  open,
  closeModal,
  children,
}: {
  title: string;
  description: string;
  open: boolean;
  closeModal: () => void;
  children: React.ReactNode;
}) {
  return (
    <Dialog open={open}>
      <DialogContent className="max-h-[50%] overflow-auto" closeModal={closeModal}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
