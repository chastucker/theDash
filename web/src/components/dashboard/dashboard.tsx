"use client";

import { Header } from "components/Header";
import { getColumns } from "components/table/getColumns";
import { DataTable } from "components/table/data-table";
import { Button } from "components/ui/button";

import {
  getGetGetPatientsQueryKey,
  useGetGetPatients,
  usePostRemovePatient,
} from "generated_client";
import React from "react";
import AddPatient from "./addPatient";
import AddCustomField from "./addCustomField";
import { useQueryClient } from "@tanstack/react-query";

export function Dashboard() {
  const { data, isFetching, refetch } = useGetGetPatients();
  const deletePatient = usePostRemovePatient();
  const queryClient = useQueryClient();

  const deletePatientHandler = async (id: string) => {
    await deletePatient.mutateAsync({ data: { ids: [id] } });
    await queryClient.invalidateQueries({
      queryKey: getGetGetPatientsQueryKey(),
    });
  };

  const columns = getColumns(data?.customFields ?? [], deletePatientHandler);

  return (
    <div className="w-[85%] space-y-4">
      <div>
        <Header />
      </div>
      <div className="flex-row flex justify-between items-center">
        <div>
          <Button
            onClick={async () => {
              await refetch();
            }}
          >
            {isFetching ? "Loading" : "refetch"}
          </Button>
        </div>
        <div>
          <AddPatient />
          <AddCustomField />
        </div>
      </div>
      <div className="w-full">
        <DataTable columns={columns} data={data?.patients ?? []} />
      </div>
    </div>
  );
}
