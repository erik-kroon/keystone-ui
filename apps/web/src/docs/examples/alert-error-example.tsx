import { Alert, AlertDescription, AlertIcon, AlertTitle } from "@/components/ui/alert";
import { CircleAlert } from "lucide-solid";

export function Component() {
  return (
    <Alert variant="error" class="w-full max-w-[25.2rem]">
      <AlertIcon>
        <CircleAlert />
      </AlertIcon>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>Describe what can be done about it here.</AlertDescription>
    </Alert>
  );
}
