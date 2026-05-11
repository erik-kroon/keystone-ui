import { Button } from "@/components/ui/button";
import { Info } from "lucide-solid";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Component() {
  return (
    <Card class="w-[22rem] max-w-full">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardPanel class="grid gap-5">
        <label class="grid gap-2 text-sm">
          <span class="font-medium text-foreground">Name</span>
          <Input placeholder="Name of your project" />
        </label>
        <label class="grid gap-2 text-sm">
          <span class="font-medium text-foreground">Framework</span>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Next.js" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="next">Next.js</SelectItem>
              <SelectItem value="solid">SolidStart</SelectItem>
              <SelectItem value="vite">Vite</SelectItem>
            </SelectContent>
          </Select>
        </label>
      </CardPanel>
      <CardFooter class="grid gap-5">
        <Button class="w-full" type="button">
          Deploy
        </Button>
        <p class="m-0 flex items-center justify-center gap-2 text-center text-muted-foreground text-sm">
          <Info aria-hidden="true" class="size-4 shrink-0 text-info" />
          <span>This will take a few seconds to complete.</span>
        </p>
      </CardFooter>
    </Card>
  );
}
