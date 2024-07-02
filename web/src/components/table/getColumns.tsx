"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import {
  GetGetPatients200CustomFieldsItem,
  GetGetPatients200PatientsItem,
} from "generated_client";
import { MoreHorizontal } from "lucide-react";

export function getColumns({
  customFields,
  deletePatientHandler,
  editPatientHandler,
}: {
  customFields: GetGetPatients200CustomFieldsItem[] | undefined;
  deletePatientHandler: (id: string) => Promise<void>;
  editPatientHandler: (patient: GetGetPatients200PatientsItem) => void;
}): ColumnDef<GetGetPatients200PatientsItem>[] {
  const customFieldsForTable: ColumnDef<GetGetPatients200PatientsItem>[] =
    customFields?.map((field, index) => {
      if (field.type === "date") {
        return {
          accessorKey: field.name,
          header: field.name,
          cell: ({ row }) => {
            if (row.original?.patientCustomFields[index]?.value) {
              return new Date(
                row.original.patientCustomFields[index].value
              ).toLocaleDateString();
            }
            return "";
          },
        };
      } else if (field.type === "boolean") {
        return {
          accessorKey: field.name,
          header: field.name,
          cell: ({ row }) => {
            if (row.original?.patientCustomFields[index]?.value) {
              return row.original.patientCustomFields[index].value
                ? "true"
                : "false";
            }
            return "";
          },
        };
      } else {
        return {
          accessorKey: field.name,
          header: field.name,
          cell: ({ row }) => {
            return row.original?.patientCustomFields[index]?.value ?? "";
          },
        };
      }
    }) ?? [];

  return [
    {
      accessorKey: "firstName",
      header: "First Name",
      size: 150,
    },
    {
      accessorKey: "middleName",
      header: "Middle Name",
      size: 150,
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
      size: 150,
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 100,
    },
    {
      accessorKey: "dateOfBirth",
      header: "Date of Birth",
      cell: ({ row }) => {
        return new Date(row.getValue("dateOfBirth")).toLocaleDateString();
      },
      size: 150,
    },
    ...customFieldsForTable,
    {
      id: "actions",
      cell: ({ row }) => {
        const patient = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => deletePatientHandler(patient.id)}
              >
                Delete Patient
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editPatientHandler(patient)}>
                Edit Patient
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 100,
    },
  ];
}
