"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ColumnDef,
  flexRender,
  SortingState,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  Table as RTable,
} from "@tanstack/react-table";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "components/ui/table";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const MAIN_COLUMNS = [
  "firstName",
  "middleName",
  "lastName",
  "dateOfBirth",
  "status",
  "addresses",
  "actions",
];

const formSchema = z
  .object({
    firstName: z.string().min(2),
    middleName: z.string(),
    lastName: z.string().min(2),
    dateOfBirth: z.date(),
    status: z.string(),
    addresses: z.array(
      z.object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
        zip: z.string(),
      })
    ),
  })
  .partial();

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const customFieldColumns = columns.filter(
    (col) => col.id && !MAIN_COLUMNS.includes(col.id)
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  return (
    <div className="rounded-md border overflow-y">
      <div className="p-4">
        <Filters<TData, TValue>
          table={table}
          customFieldColumns={customFieldColumns}
        />
      </div>
      <div>
        <FormProvider {...form}>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        style={{
                          minWidth: header.column.columnDef.size,
                          maxWidth: header.column.columnDef.size,
                        }}
                        key={header.id}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{
                          minWidth: cell.column.columnDef.size,
                          maxWidth: cell.column.columnDef.size,
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </FormProvider>
      </div>
      <div className="flex items-center justify-end space-x-2 p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function Filters<TData, TValue>({
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
      <div className="flex flex-row items-center justify-center space-x-2 space-y-0 py-4">
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
              key={col.id}
              table={table}
              columnId={col.id}
              name={col.accessorKey}
            />
          ))}
      </div>
      {otherColumnsChunks.map((group) => (
        <div className="flex flex-row items-center justify-center space-x-2 space-y-0 py-4">
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
                key={col.id}
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
