import { createToastManager } from "@keystone-ui/core/toast";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toast";

export function Component() {
  const toastManager = createToastManager();

  return (
    <div class="flex min-h-72 w-full flex-col items-center justify-center gap-3">
      <Button
        type="button"
        onClick={() =>
          toastManager.success({ title: "Saved", description: "Your changes were synced." })
        }
      >
        Show toast
      </Button>
      <Toaster manager={toastManager} />
    </div>
  );
}
