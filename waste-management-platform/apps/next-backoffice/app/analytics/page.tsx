"use client";

import { useVolumeData } from "@/lib/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Download } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { format, subDays } from "date-fns";
import { cn } from "@/lib/utils";

// Generate mock heatmap data (Hour of day vs Day of week)
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 12 }, (_, i) => `${i + 8}:00`); // 8am to 7pm

const heatmapData = days.map(day => ({
  day,
  hours: hours.map(hour => ({
    hour,
    value: Math.floor(Math.random() * 100),
  }))
}));

// Function to determine Tailwind color based on value intensity
const getHeatmapColor = (value: number) => {
  if (value < 20) return "bg-success/10 text-success/60";
  if (value < 40) return "bg-success/30 text-success/80";
  if (value < 60) return "bg-success/60 text-success-foreground font-medium";
  if (value < 80) return "bg-success/80 text-success-foreground font-bold";
  return "bg-success text-success-foreground font-bold shadow-sm ring-1 ring-inset ring-success-foreground/20";
};

// Accuracy trend mock data
const accuracyData = Array.from({ length: 14 }).map((_, i) => ({
  date: format(subDays(new Date(), 13 - i), "MMM dd"),
  organic: 85 + Math.random() * 10,
  plastic: 90 + Math.random() * 8,
  metal:  95 + Math.random() * 4,
}));

export default function AnalyticsPage() {
  const { data: volume, isLoading } = useVolumeData();
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
          <p className="text-muted-foreground">Deep dive into collection patterns and AI model performance.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal bg-card">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>AI Accuracy Trend</CardTitle>
            <CardDescription>Model classification accuracy per category over 14 days.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={accuracyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis domain={[80, 100]} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px' }}
                />
                <Line type="stepAfter" dataKey="organic" stroke="#16a34a" strokeWidth={2} dot={false} />
                <Line type="stepAfter" dataKey="plastic" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="stepAfter" dataKey="metal" stroke="#64748b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Collection Zones</CardTitle>
            <CardDescription>Volume (kg) grouped by geographical zones.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {isLoading ? <Skeleton className="h-full w-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Zone A-N', value: 4000 },
                  { name: 'Zone B-E', value: 3000 },
                  { name: 'Zone D-S', value: 2000 },
                  { name: 'Zone C-W', value: 2780 },
                  { name: 'Zone A-S', value: 1890 },
                ]} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px' }} />
                  <Bar dataKey="value" fill="#16a34a" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Collection Activity Heatmap</CardTitle>
            <CardDescription>Relative frequency of waste scanning events.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto pb-6">
            <div className="min-w-[700px]">
              <div className="grid grid-cols-13 gap-1 mb-1">
                <div className="w-12"></div> {/* Spacing for Y axis labels */}
                {hours.map(hour => (
                  <div key={hour} className="text-xs text-center text-muted-foreground">{hour}</div>
                ))}
              </div>
              
              <div className="space-y-1">
                {heatmapData.map((row) => (
                  <div key={row.day} className="flex gap-1 items-center">
                    <div className="w-12 text-xs font-medium text-muted-foreground">{row.day}</div>
                    {row.hours.map((cell, i) => (
                      <div 
                        key={`${row.day}-${i}`}
                        className={cn(
                          "flex-1 h-8 rounded-sm flex items-center justify-center text-[10px] transition-all hover:ring-2 ring-primary hover:z-10", 
                          getHeatmapColor(cell.value)
                        )}
                        title={`${row.day} ${cell.hour}: ${cell.value} scans`}
                      >
                        {cell.value > 20 ? cell.value : ''}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground justify-end w-full">
                <span>Low</span>
                <div className="flex gap-0.5">
                  <div className="h-3 w-3 rounded-sm bg-success/10" />
                  <div className="h-3 w-3 rounded-sm bg-success/30" />
                  <div className="h-3 w-3 rounded-sm bg-success/60" />
                  <div className="h-3 w-3 rounded-sm bg-success/80" />
                  <div className="h-3 w-3 rounded-sm bg-success" />
                </div>
                <span>High</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
