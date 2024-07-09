"use client";

import { ColumnDef, Table as RTable } from "@tanstack/react-table";
import { Input } from "components/ui/input";

export function Filters<TData, TValue>({
  table,
  customFieldColumns,
}: {
  table: RTable<TData>;
  customFieldColumns: ColumnDef<TData, TValue>[];
}) {
  const firstTwoColumns = customFieldColumns.slice(0, 2);
  const otherColumns = customFieldColumns.slice(2);
  const otherColumnsChunks: ColumnDef<TData, TValue>[][] = [];
  for (let i = 0; i < otherColumns.length; i += 4) {
    otherColumnsChunks.push(customFieldColumns.slice(i, i + 4));
  }

  return (
    <>
      <div className="flex flex-row items-center space-x-2 space-y-0 ">
        <FilterInput<TData>
          table={table}
          columnId="firstName"
          name="First Name"
        />

        <FilterInput<TData>
          table={table}
          columnId="middleName"
          name="Middle Name"
        />
        <FilterInput<TData>
          table={table}
          columnId="lastName"
          name="Last Name"
        />
        <FilterInput<TData> table={table} columnId="status" name="Status" />
      </div>
      <div className="flex flex-row items-center justify-center space-x-2 py-4">
        <FilterInput<TData>
          table={table}
          columnId="dateOfBirth"
          name="Date of Birth"
        />
        <FilterInput<TData> table={table} columnId="addresses" name="Address" />
        {firstTwoColumns
          .filter(
            (
              col
            ): col is { id: NonNullable<typeof col.id>; accessorKey: string } =>
              Boolean(col.id)
          )
          .map((col) => (
            <FilterInput<TData>
              key={col.accessorKey}
              table={table}
              columnId={col.id}
              name={col.accessorKey}
            />
          ))}
      </div>
      {otherColumnsChunks.map((group, i) => (
        <div
          key={i}
          className={`flex flex-row items-center justify-center space-x-2 ${
            i > 0 ? "pt-4" : ""
          }`}
        >
          {group
            .filter(
              (
                col
              ): col is {
                id: NonNullable<typeof col.id>;
                accessorKey: string;
              } => Boolean(col.id)
            )
            .map((col) => (
              <FilterInput<TData>
                key={col.accessorKey}
                table={table}
                columnId={col.id}
                name={col.accessorKey}
              />
            ))}
        </div>
      ))}
    </>
  );
}

function FilterInput<TData>({
  table,
  columnId,
  name,
}: {
  table: RTable<TData>;
  columnId: string;
  name: string;
}) {
  return (
    <Input
      placeholder={`Filter by ${name}...`}
      value={(table.getColumn(columnId)?.getFilterValue() as string) ?? ""}
      onChange={(event) => {
        table.getColumn(columnId)?.setFilterValue(event.target.value);
      }}
      className="max-w-sm"
    />
  );
}
