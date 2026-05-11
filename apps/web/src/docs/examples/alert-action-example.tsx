import { Info } from "lucide-solid";
import { Alert, AlertAction, AlertDescription, AlertIcon, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function Component() {
  return (
    <Alert class="w-full max-w-xl">
      <AlertIcon>
        <Info />
      </AlertIcon>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>Describe what can be done about it here.</AlertDescription>
      <AlertAction>
        <Button size="sm" type="button" variant="ghost">
          Dismiss
        </Button>
        <Button size="sm" type="button">
          Ok
        </Button>
      </AlertAction>
    </Alert>
  );
}
