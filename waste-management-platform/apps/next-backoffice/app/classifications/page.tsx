"use client";

import { useClassifications } from "@/lib/hooks";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClassificationsPage() {
  const { data, isLoading } = useClassifications();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Classifications Review</h1>
        <p className="text-muted-foreground">Manage and override AI classification outputs across all locations.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      ) : (
        <DataTable columns={columns} data={data || []} />
      )}
    </div>
  );
}
