"use client";

import { useWasteItems } from "@/lib/hooks";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Search, LayoutGrid, List } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Image from "next/image";
import { format } from "date-fns";

export default function WasteItemsPage() {
  const { data: items, isLoading } = useWasteItems();
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filteredItems = items?.filter(
    item =>
      item.predictedCategory.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Waste Items Registry</h1>
        <p className="text-muted-foreground">Browse all processed waste items captured by field agents.</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search items, locations..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <ToggleGroup type="single" value={view} onValueChange={(v: any) => v && setView(v as "grid" | "list")}>
          <ToggleGroupItem value="grid" aria-label="Grid View">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List View">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(12).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : (
        <div className={
          view === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
            : "flex flex-col gap-2"
        }>
          {filteredItems?.map((item) => (
            <Card key={item.id} className={view === "list" ? "flex flex-row overflow-hidden h-32" : "overflow-hidden flex flex-col"}>
              <div className={`relative ${view === "list" ? "w-32 h-full shrink-0" : "w-full h-40"} bg-muted`}>
                <Image
                  src={item.imageUrl}
                  alt={item.predictedCategory}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <Badge
                  className={`absolute top-2 right-2 ${item.confidence > 90 ? "bg-success/90 hover:bg-success" :
                      item.confidence > 70 ? "bg-warning/90 hover:bg-warning" : "bg-destructive/90 hover:bg-destructive"
                    }`}
                >
                  {item.confidence}%
                </Badge>
              </div>

              <div className={`p-4 flex-1 flex flex-col ${view === "list" ? "justify-center" : ""}`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{item.predictedCategory}</h3>
                  <span className="text-xs font-mono text-muted-foreground">#{item.id.substring(0, 6)}</span>
                </div>

                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="flex items-center">
                    <span className="font-medium w-16">Location:</span> {item.location}
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium w-16">Agent:</span> {item.collectorId}
                  </p>
                  <p className="flex items-center text-xs pt-1">
                    {format(new Date(item.timestamp), "MMM d, yyyy HH:mm")}
                  </p>
                </div>
              </div>
            </Card>
          ))}
          {filteredItems?.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No waste items match your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
