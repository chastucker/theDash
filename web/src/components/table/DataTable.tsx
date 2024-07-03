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
import { Filters } from "./Filter";

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
  showFilters,
}: DataTableProps<TData, TValue> & { showFilters: boolean }) {
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
      {!showFilters && (
        <div className="p-4">
          <Filters<TData, TValue>
            table={table}
            customFieldColumns={customFieldColumns}
          />
        </div>
      )}
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
