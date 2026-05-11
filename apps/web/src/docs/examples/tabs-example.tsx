import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function Component() {
  return (
    <Tabs defaultValue="overview" class="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" class="rounded-lg border border-border p-4 text-sm">
        Track the current workspace state.
      </TabsContent>
      <TabsContent value="activity" class="rounded-lg border border-border p-4 text-sm">
        Review recent changes.
      </TabsContent>
      <TabsContent value="settings" class="rounded-lg border border-border p-4 text-sm">
        Configure defaults and permissions.
      </TabsContent>
    </Tabs>
  );
}
