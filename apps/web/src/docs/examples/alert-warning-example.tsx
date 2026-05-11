import { Alert, AlertDescription, AlertIcon, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-solid";

export function Component() {
  return (
    <Alert variant="warning" class="w-full max-w-[25.2rem]">
      <AlertIcon>
        <TriangleAlert />
      </AlertIcon>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>Describe what can be done about it here.</AlertDescription>
    </Alert>
  );
}
