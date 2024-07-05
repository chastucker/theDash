"use client";

import React, { useState } from "react";
import { Header } from "components/Header";
import { getColumns } from "components/table/getColumns";
import { DataTable } from "components/table/DataTable";
import { Button } from "components/ui/button";

import {
  getGetGetPatientsQueryKey,
  GetGetPatients200PatientsItem,
  useGetGetPatients,
  usePostRemovePatient,
} from "generated_client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "components/ui/use-toast";
import Modal from "components/ui/modal";
import { AddEditCustomFieldForm, AddEditPatientForm } from "components/forms";

export function Dashboard() {
  const { data, isFetching, refetch } = useGetGetPatients();
  const deletePatient = usePostRemovePatient();
  const queryClient = useQueryClient();

  const [isAddEditPatientModalOpen, setIsAddEditPatientModalOpen] =
    useState(false);
  const [isAddEditCustomFieldModalOpen, setIsAddEditCustomFieldModalOpen] =
    useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [patient, setPatient] = useState<
    GetGetPatients200PatientsItem | undefined
  >(undefined);
  const { toast } = useToast();

  const deletePatientHandler = async (id: string) => {
    try {
      await deletePatient.mutateAsync({ data: { ids: [id] } });
      await queryClient.invalidateQueries({
        queryKey: getGetGetPatientsQueryKey(),
      });
      toast({
        title: "Patient Deleted Successfully",
      });
    } catch {
      toast({
        title: "Error Deleting Patient",
        variant: "destructive",
      });
    }
  };

  const refetchPatients = async () => {
    await refetch();
  };

  const editPatientHandler = (patient: GetGetPatients200PatientsItem) => {
    setPatient(patient);
    setIsEditModalOpen(true);
  };

  const closeAddEditPatientModal = () => {
    setIsAddEditPatientModalOpen(false);
  };

  const openAddEditPatientModal = () => {
    setIsAddEditPatientModalOpen(true);
  };

  const openAddEditCustomFieldModal = () => {
    setIsAddEditCustomFieldModalOpen(true);
  };

  const closeAddEditCustomFieldModal = () => {
    setIsAddEditCustomFieldModalOpen(false);
  };

  const closeEditModal = () => {
    setPatient(undefined);
    setIsEditModalOpen(false);
  };

  const columns = getColumns({
    customFields: data?.customFields ?? [],
    deletePatientHandler,
    editPatientHandler,
  });

  return (
    <div className="w-[85%] space-y-4">
      <Modal
        title="Add Patient"
        closeModal={closeAddEditPatientModal}
        open={isAddEditPatientModalOpen}
        description="Add a patient to the group"
      >
        <AddEditPatientForm
          customFields={data?.customFields ?? []}
          closeModal={closeAddEditPatientModal}
        />
      </Modal>
      <Modal
        title="Modify Column"
        description="Add or edit a column"
        open={isAddEditCustomFieldModalOpen}
        closeModal={closeAddEditCustomFieldModal}
      >
        <AddEditCustomFieldForm
          customFields={data?.customFields ?? []}
          closeModal={closeAddEditCustomFieldModal}
        />
      </Modal>
      <Modal
        open={isEditModalOpen}
        closeModal={closeEditModal}
        title="Edit Patient"
        description="Edit a patient in the group"
      >
        <AddEditPatientForm
          patient={patient}
          customFields={data?.customFields ?? []}
          closeModal={closeEditModal}
        />
      </Modal>
      <div>
        <Header />
      </div>
      <div className="flex-row flex justify-between items-center">
        <div>
          <Button onClick={refetchPatients}>
            {isFetching ? "Loading..." : "Refresh"}
          </Button>
        </div>
        <div className="space-x-2">
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={() => {
              setShowFilters(!showFilters);
            }}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          <Button
            className="bg-green-500 text-white hover:bg-green-600"
            onClick={openAddEditPatientModal}
          >
            Add Patient
          </Button>
          <Button
            className="bg-indigo-500 text-white hover:bg-indigo-600"
            onClick={openAddEditCustomFieldModal}
          >
            Modify Columns
          </Button>
        </div>
      </div>
      <div className="w-full">
        <DataTable
          showFilters={showFilters}
          columns={columns}
          data={data?.patients ?? []}
        />
      </div>
    </div>
  );
}
