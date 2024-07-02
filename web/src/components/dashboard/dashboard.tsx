"use client";

import { Header } from "components/Header";
import { getColumns } from "components/table/getColumns";
import { DataTable } from "components/table/data-table";
import { Button } from "components/ui/button";

import {
  getGetGetPatientsQueryKey,
  GetGetPatients200PatientsItem,
  useGetGetPatients,
  usePostRemovePatient,
} from "generated_client";
import React, { useState } from "react";
import AddPatient from "./addPatient";
import AddCustomField from "./addCustomField";
import { useQueryClient } from "@tanstack/react-query";
import EditPatient from "./editPatient";

export function Dashboard() {
  const { data, isFetching, refetch } = useGetGetPatients();
  const deletePatient = usePostRemovePatient();
  const queryClient = useQueryClient();
  const [patient, setPatient] = useState<
    GetGetPatients200PatientsItem | undefined
  >(undefined);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const deletePatientHandler = async (id: string) => {
    await deletePatient.mutateAsync({ data: { ids: [id] } });
    await queryClient.invalidateQueries({
      queryKey: getGetGetPatientsQueryKey(),
    });
  };

  const closeEditModal = () => {
    setPatient(undefined);
    setIsEditModalOpen(false);
  };

  const editPatientHandler = (patient: GetGetPatients200PatientsItem) => {
    setPatient(patient);
    setIsEditModalOpen(true);
  };

  const columns = getColumns({
    customFields: data?.customFields ?? [],
    deletePatientHandler,
    editPatientHandler,
  });

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
            {isFetching ? "Loading" : "Refresh"}
          </Button>
        </div>
        <div>
          <AddPatient customFields={data?.customFields ?? []} />
          <AddCustomField />
        </div>
      </div>
      <div className="w-full">
        <DataTable columns={columns} data={data?.patients ?? []} />
        <EditPatient
          patient={patient}
          open={isEditModalOpen}
          closeModal={closeEditModal}
          customFields={data?.customFields ?? []}
        />
      </div>
    </div>
  );
}
