"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Classification } from "@/types";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { useConfirmClassification, useRejectClassification } from "@/lib/hooks";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedRow, setSelectedRow] = useState<Classification | null>(null);

  const confirmMutation = useConfirmClassification();
  const rejectMutation = useRejectClassification();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <div>
      <div className="flex items-center py-4 gap-4">
        <Input
          placeholder="Filter by ID..."
          value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("id")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        {/* Further advanced filters would go here */}
      </div>
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
                  onClick={() => setSelectedRow(row.original as Classification)}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
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

      <Sheet open={!!selectedRow} onOpenChange={(open) => !open && setSelectedRow(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Classification #{selectedRow?.id}</SheetTitle>
            <SheetDescription>
              Details and actions for this AI classification.
            </SheetDescription>
          </SheetHeader>
          
          {selectedRow && (
            <div className="space-y-6 py-6">
              <div className="relative h-64 w-full rounded-md overflow-hidden bg-muted border">
                <Image 
                  src={selectedRow.imageUrl} 
                  alt="Full resolution scan" 
                  fill 
                  className="object-contain"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">PREDICTED CATEGORY</Label>
                  <p className="font-medium">{selectedRow.predictedCategory}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">CONFIDENCE</Label>
                  <p className="font-mono text-success">{selectedRow.confidence}%</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">STATUS</Label>
                  <p className="font-medium">{selectedRow.status}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">TIMESTAMP</Label>
                  <p className="font-mono text-sm">{new Date(selectedRow.timestamp).toLocaleString()}</p>
                </div>
              </div>

              {selectedRow.status === "PENDING" && (
                <div className="pt-4 border-t flex gap-3">
                  <Button 
                    className="flex-1 bg-success hover:bg-success/90" 
                    disabled={confirmMutation.isPending}
                    onClick={() => {
                      confirmMutation.mutate({ id: selectedRow.id, category: selectedRow.predictedCategory });
                      setSelectedRow(null);
                    }}
                  >
                    Confirm Correct
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                    disabled={rejectMutation.isPending}
                    onClick={() => {
                      rejectMutation.mutate(selectedRow.id);
                      setSelectedRow(null);
                    }}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
