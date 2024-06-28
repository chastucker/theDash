"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import {
  getGetGetPatientsQueryKey,
  GetGetPatients200Item,
  usePostRemovePatient,
} from "generated_client";
import { MoreHorizontal } from "lucide-react";

export const columns: ColumnDef<GetGetPatients200Item>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "middleName",
    header: "Middle Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "dateOfBirth",
    header: "Date of Birth",
    cell: ({ row }) => {
      return new Date(row.getValue("dateOfBirth")).toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const patient = row.original;

      const deletePatient = usePostRemovePatient();
      const queryClient = useQueryClient();

      const deletePatientHandler = async () => {
        await deletePatient.mutateAsync({ data: { ids: [patient.id] } });
        await queryClient.invalidateQueries({
          queryKey: getGetGetPatientsQueryKey(),
        });
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={deletePatientHandler}>
              Delete Patient
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                console.log("open the edit window");
              }}
            >
              Edit Patient
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
