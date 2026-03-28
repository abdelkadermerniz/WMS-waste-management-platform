"use client";

import { useCollectors, useCreateCollector } from "@/lib/hooks";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UserPlus, Search, MapPin } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const collectorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  zone: z.string().min(2, "Zone identifier required"),
});

export default function CollectorsPage() {
  const { data: collectors, isLoading } = useCollectors();
  const createMutation = useCreateCollector();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof collectorSchema>>({
    resolver: zodResolver(collectorSchema),
    defaultValues: {
      name: "",
      zone: "",
    },
  });

  const onSubmit = (values: z.infer<typeof collectorSchema>) => {
    createMutation.mutate(
      { name: values.name, zone: values.zone, status: "ACTIVE" },
      {
        onSuccess: () => {
          setOpen(false);
          form.reset();
          toast({
            title: "Collector Registered",
            description: `${values.name} has been added to ${values.zone}.`,
          });
        }
      }
    );
  };

  const filtered = collectors?.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.zone.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Field Agents</h1>
          <p className="text-muted-foreground">Manage active waist collectors and their assigned operational zones.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Agent
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register New Agent</DialogTitle>
              <DialogDescription>
                Assign a new field agent to an active sector logic gate. This will generate their mobile app credentials.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name / Call Sign</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Charlie-Alpha" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigned District/Zone</FormLabel>
                      <FormControl>
                        <Input placeholder="Zone C-West" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="pt-4">
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Provisioning..." : "Provision Access"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search agents or districts..."
              className="pl-8 bg-card"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="rounded-md border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Agent Profile</TableHead>
                  <TableHead>Active Zone</TableHead>
                  <TableHead className="text-right">Shift Collections</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={4} className="h-24 text-center text-muted-foreground">Loading roster...</TableCell></TableRow>
                ) : filtered?.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No personnel match search parameters.</TableCell></TableRow>
                ) : (
                  filtered?.map((collector) => (
                    <TableRow key={collector.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                            {collector.name.substring(0,2).toUpperCase()}
                          </div>
                          {collector.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-muted-foreground text-sm">
                          <MapPin className="mr-1 h-3 w-3" />
                          {collector.zone}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {collector.itemsCollectedToday}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={collector.status === "ACTIVE" ? "default" : "secondary"}
                               className={collector.status === "ACTIVE" ? "bg-success hover:bg-success/90" : ""}>
                          {collector.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="md:col-span-1 rounded-md border bg-muted relative overflow-hidden flex items-center justify-center h-[400px] md:h-auto">
          {/* Static Map Placeholder as requested */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30 dark:opacity-20 grayscale"></div>
          <div className="relative z-10 p-6 flex flex-col items-center text-center space-y-2 bg-background/80 backdrop-blur rounded border">
            <MapPin className="h-8 w-8 text-primary" />
            <h3 className="font-semibold text-lg">Live Fleet Tracking</h3>
            <p className="text-sm text-muted-foreground max-w-[200px]">Agent geolocation is strictly mapped during active shifts.</p>
            <Button variant="outline" size="sm" className="mt-4">Expand Map</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
