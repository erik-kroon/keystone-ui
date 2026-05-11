import { Info } from "lucide-solid";
import { Alert, AlertDescription, AlertIcon, AlertTitle } from "@/components/ui/alert";

export function Component() {
  return (
    <Alert variant="info" class="w-full max-w-[25.2rem]">
      <AlertIcon>
        <Info />
      </AlertIcon>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>Describe what can be done about it here.</AlertDescription>
    </Alert>
  );
}
