"use client";

import { useSettings, useUpdateSettings } from "@/lib/hooks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Copy, EyeOff, ShieldAlert, Key } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useEffect } from "react";

const aiModelSchema = z.object({
  confidenceThreshold: z.number().min(50).max(99),
  autoConfirmAboveThreshold: z.boolean(),
  modelVersion: z.string(),
});

export default function SettingsPage() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof aiModelSchema>>({
    resolver: zodResolver(aiModelSchema),
    defaultValues: {
      confidenceThreshold: 85,
      autoConfirmAboveThreshold: false,
      modelVersion: "v1.4.2 (ResNet50)",
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset(settings);
    }
  }, [settings, form]);

  const onSubmit = (values: z.infer<typeof aiModelSchema>) => {
    updateSettings.mutate(values, {
      onSuccess: () => {
        toast({
          title: "Settings Updated",
          description: "AI Model configurations have been saved successfully.",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to update settings.",
          variant: "destructive",
        });
      }
    });
  };



  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">System Configuration</h1>
        <p className="text-muted-foreground">Manage application settings, AI classification models, and service API keys.</p>
      </div>

      <Tabs defaultValue="ai-model" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="ai-model">AI Model</TabsTrigger>
          <TabsTrigger value="notifications">Alerts</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure your platform preferences and localization.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <FormLabel>Timezone</FormLabel>
                <Select defaultValue="utc">
                  <SelectTrigger className="w-full max-w-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                    <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                    <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Preference</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="ai-model" className="mt-6">
          <Card className="border-success/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-success" />
                Classification Engine Rules
              </CardTitle>
              <CardDescription>Adjust how aggressive the AI engine auto-labels incoming waste streams.</CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-8">
                  <FormField
                    control={form.control}
                    name="confidenceThreshold"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex justify-between">
                          <span>Confidence Threshold</span>
                          <span className="font-mono text-success">{field.value}%</span>
                        </FormLabel>
                        <FormControl>
                          <Slider
                            min={50}
                            max={99}
                            step={1}
                            defaultValue={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                            className="py-4"
                          />
                        </FormControl>
                        <FormDescription>
                          Classifications below this score will be sent to the manual review queue.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="autoConfirmAboveThreshold"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Auto-Confirm Mode</FormLabel>
                          <FormDescription>
                            Automatically label and index database rows if threshold is met.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="modelVersion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Active Neural Network Model</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full md:w-1/2">
                              <SelectValue placeholder="Select a trained model..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="v1.4.2 (ResNet50)">v1.4.2 (ResNet50) - Current</SelectItem>
                            <SelectItem value="v1.4.1 (ResNet50)">v1.4.1 (ResNet50) - Rollback</SelectItem>
                            <SelectItem value="v2.0.0-beta (EfficientNet)">v2.0.0-beta (EfficientNet) - Experimental</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-between items-center bg-muted/50 rounded-b-lg border-t py-4">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-success"></span>
                    Model engine reporting healthy metrics.
                  </p>
                  <Button type="submit" disabled={updateSettings.isPending || isLoading}>
                    {updateSettings.isPending ? "Applying..." : "Apply AI Configuration"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>

        <TabsContent value="api-keys" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>API Tokens</CardTitle>
              <CardDescription>Manage keys used for authenticated ingestion from edge IoT sensors and agents.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <FormLabel>Primary Production Key</FormLabel>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-0 top-0 text-muted-foreground"
                    >
                      <EyeOff className="h-4 w-4" />
                    </Button>
                  </div>
                 
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Key className="mr-2 h-4 w-4" />
                    Regenerate Key
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will immediately revoke your current primary API key. 
                      All active field scanner applications using this key will be disconnected until reconfigured.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90 select-none">
                      Yes, rotate keys
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h4 className="font-semibold text-sm">Critical Errors</h4>
                  <p className="text-sm text-muted-foreground">Receive instant alerts if AI service goes down.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between pb-4">
                <div>
                  <h4 className="font-semibold text-sm">Daily Summary</h4>
                  <p className="text-sm text-muted-foreground">Email snapshot of yesterday's processing volumes.</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
