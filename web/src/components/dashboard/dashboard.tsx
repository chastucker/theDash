"use client";

import { Header } from "components/Header";
import { columns } from "components/table/columns";
import { DataTable } from "components/table/data-table";
import { Button } from "components/ui/button";

import { useGetGetPatients } from "generated_client";
import React from "react";
import AddPatient from "./addPatient";
import AddCustomField from "./addCustomField";

export function Dashboard() {
  const { data, isFetching, refetch } = useGetGetPatients();

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
        <DataTable columns={columns} data={data ?? []} />
      </div>
    </div>
  );
}
