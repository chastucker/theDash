"use client";

import { Column, ColumnDef } from "@tanstack/react-table";
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
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

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
    customFields?.map((field) => {
      const base = {
        id: field.id,
        accessorKey: field.name,
        header: field.name,
      };

      if (field.type === "date") {
        return {
          ...base,
          cell: ({ row }) => {
            const val = row.original?.patientCustomFields.find((t) => {
              if (t.customFieldId === field.id) {
                return t;
              }
            });

            if (val && val?.value) {
              return new Date(val.value).toLocaleDateString();
            }
            return "";
          },
          filterFn: (rows, id, filterValue) => {
            const vals = rows.original?.patientCustomFields.find(
              (patientCustomField) => {
                return patientCustomField.customFieldId === id;
              }
            );

            return Boolean(
              vals &&
                vals.value &&
                new Date(vals.value)
                  .toLocaleDateString()
                  .includes(filterValue.toLowerCase())
            );
          },
        };
      } else if (field.type === "boolean") {
        return {
          ...base,
          cell: ({ row }) => {
            const val = row.original?.patientCustomFields.find((t) => {
              if (t.customFieldId === field.id) {
                return t;
              }
            });

            if (val && val.value) {
              return val.value;
            }
            return "false";
          },
          filterFn: (rows, id, filterValue) => {
            const vals = rows.original?.patientCustomFields.find(
              (patientCustomField) => {
                return patientCustomField.customFieldId === id;
              }
            );

            return Boolean(
              vals &&
                vals.value &&
                vals.value.toLowerCase().includes(filterValue.toLowerCase())
            );
          },
        };
      } else {
        return {
          ...base,
          cell: ({ row }) => {
            const val = row.original?.patientCustomFields.find((t) => {
              if (t.customFieldId === field.id) {
                return t;
              }
            });

            if (val && val.value) {
              return val.value;
            }
            return "";
          },
          filterFn: (rows, id, filterValue) => {
            const vals = rows.original?.patientCustomFields.find(
              (patientCustomField) => {
                return patientCustomField.customFieldId === id;
              }
            );

            return Boolean(
              vals &&
                vals.value &&
                vals.value.toLowerCase().includes(filterValue.toLowerCase())
            );
          },
        };
      }
    }) ?? [];

  return [
    {
      id: "firstName",
      accessorKey: "firstName",
      header: ({ column }) => <SortColumn column={column} name="First Name" />,
      size: 150,
    },
    {
      id: "middleName",
      accessorKey: "middleName",
      header: ({ column }) => <SortColumn column={column} name="Middle Name" />,
      size: 150,
    },
    {
      id: "lastName",
      accessorKey: "lastName",
      header: ({ column }) => <SortColumn column={column} name="Last Name" />,
      size: 150,
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }) => <SortColumn column={column} name="Status" />,
      size: 100,
    },
    {
      id: "addresses",
      accessorKey: "addresses",
      header: "Addresses",
      cell: ({ row }) => {
        const addresses = row.original?.addresses;
        return (
          addresses?.map((address) => {
            return (
              <div key={address.id}>
                <p>
                  {address.street} <br /> {address.city}, {address.state},{" "}
                  {address.zip}
                </p>
                <br />
              </div>
            );
          }) ?? ""
        );
      },
      filterFn: (rows, _, filterValue) => {
        const addresses = rows.original?.addresses;

        for (const address of rows.original?.addresses) {
          if (
            address.street.toLowerCase().includes(filterValue.toLowerCase()) ||
            address.city.toLowerCase().includes(filterValue.toLowerCase()) ||
            address.state.toLowerCase().includes(filterValue.toLowerCase()) ||
            address.zip.toLowerCase().includes(filterValue.toLowerCase())
          ) {
            return true;
          }
        }

        return false;
      },
    },
    {
      id: "dateOfBirth",
      accessorKey: "dateOfBirth",
      header: ({ column }) => (
        <SortColumn column={column} name="Date of Birth" />
      ),
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

function SortColumn({
  column,
  name,
}: {
  column: Column<GetGetPatients200PatientsItem, unknown>;
  name: string;
}) {
  return (
    <Button
      variant="ghost"
      onClick={() => {
        column.toggleSorting(column.getIsSorted() === "asc");
      }}
    >
      {name}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}
