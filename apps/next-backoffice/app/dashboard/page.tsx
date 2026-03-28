"use client";

import {
  useDashboardStats,
  useVolumeData,
  useDistributionData,
  useClassifications
} from "@/lib/hooks";
import {
  Area, AreaChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis,
  Cell, Pie, PieChart
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Leaf, Box, Layers, Factory, Target } from "lucide-react";
import Image from "next/image";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: volume, isLoading: volumeLoading } = useVolumeData();
  const { data: distribution, isLoading: distLoading } = useDistributionData();
  const { data: classifications, isLoading: clsLoading } = useClassifications();

  const recentItems = classifications?.slice(0, 10) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-success/10 text-success border-success/20 py-1">
            <span className="h-2 w-2 rounded-full bg-success mr-2 animate-pulse" />
            AI Service Online
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsLoading ? (
          Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32" />)
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Processed Today</CardTitle>
                <Box className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono">{stats?.totalProcessedToday.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+12.5% from yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Classification Accuracy</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono text-success">{stats?.accuracyPercentage}%</div>
                <p className="text-xs text-muted-foreground">+0.2% from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                <Layers className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono text-warning">{stats?.itemsPendingReview}</div>
                <p className="text-xs text-muted-foreground">-4% requiring manual confirmation</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Est. CO₂ Saved</CardTitle>
                <Leaf className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono text-success">
                  {stats?.co2SavedKg.toLocaleString()} <span className="text-sm font-normal">kg</span>
                </div>
                <p className="text-xs text-muted-foreground">+18% vs last month</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-4">
          <CardHeader>
            <CardTitle>Volume Over 30 Days</CardTitle>
            <CardDescription>Estimated waste volumes (kg) across categories.</CardDescription>
          </CardHeader>
          <CardContent className="pl-0 h-[300px]">
            {volumeLoading ? (
              <Skeleton className="h-full w-full ml-6" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={volume} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorOrg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPlast" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorMet" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#64748b" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}kg`} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area type="monotone" dataKey="ORGANIC" stackId="1" stroke="#16a34a" fill="url(#colorOrg)" />
                  <Area type="monotone" dataKey="PLASTIC" stackId="1" stroke="#3b82f6" fill="url(#colorPlast)" />
                  <Area type="monotone" dataKey="METAL" stackId="1" stroke="#64748b" fill="url(#colorMet)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-full lg:col-span-3">
          <CardHeader>
            <CardTitle>Distribution Focus</CardTitle>
            <CardDescription>Processed items by detected material type.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            {distLoading ? (
              <Skeleton className="h-[200px] w-[200px] rounded-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {distribution?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent AI Classifications</CardTitle>
          <CardDescription>Live feed of processing lines across all zones.</CardDescription>
        </CardHeader>
        <CardContent>
          {clsLoading ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : (
            <div className="space-y-4">
              {recentItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 rounded bg-muted overflow-hidden border">
                      <Image
                        src={item.imageUrl}
                        alt="Scanned item"
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.predictedCategory}</p>
                      <p className="text-xs text-muted-foreground font-mono">{new Date(item.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <Badge
                    variant={item.confidence > 90 ? "default" : item.confidence > 70 ? "secondary" : "destructive"}
                    className={
                      item.confidence > 90 ? "bg-success/20 text-success hover:bg-success/30" :
                        item.confidence > 70 ? "bg-warning/20 text-warning hover:bg-warning/30" : ""
                    }
                  >
                    {item.confidence}% Confidence
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
