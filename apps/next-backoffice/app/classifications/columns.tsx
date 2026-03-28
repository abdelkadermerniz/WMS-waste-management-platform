"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Classification } from "@/types";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { format } from "date-fns";

export const columns: ColumnDef<Classification>[] = [
  {
    accessorKey: "imageUrl",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl = row.getValue("imageUrl") as string;
      return (
        <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded overflow-hidden border">
          <Image 
            src={imageUrl} 
            alt="Waste Item" 
            fill 
            className="object-cover"
            sizes="48px"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <span className="font-mono text-xs">{row.getValue("id")}</span>,
  },
  {
    accessorKey: "predictedCategory",
    header: "Predicted Category",
    cell: ({ row }) => <span className="font-medium text-sm">{row.getValue("predictedCategory")}</span>,
  },
  {
    accessorKey: "confidence",
    header: "Confidence",
    cell: ({ row }) => {
      const conf = row.getValue("confidence") as number;
      return (
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className={
              conf > 90 ? "border-success text-success bg-success/10" : 
              conf > 70 ? "border-warning text-warning bg-warning/10" : 
              "border-destructive text-destructive bg-destructive/10"
            }
          >
            {conf}%
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "CONFIRMED" ? "default" : status === "REJECTED" ? "destructive" : "secondary"}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) => {
      const timestamp = row.getValue("timestamp") as string;
      return <span className="text-muted-foreground text-sm font-mono">{format(new Date(timestamp), "MMM d, HH:mm")}</span>;
    },
  },
];
