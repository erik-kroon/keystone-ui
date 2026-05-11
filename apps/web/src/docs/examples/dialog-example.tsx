import { Button, buttonClass } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function Component() {
  return (
    <Dialog>
      <DialogTrigger
        class="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-md border border-primary bg-primary px-3 text-primary-foreground text-sm font-medium leading-none shadow-xs/5 outline-none transition-colors hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/24 sm:min-h-8"
        type="button"
      >
        Open dialog
      </DialogTrigger>
      <DialogContent class="sm:w-96">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <DialogPanel class="grid gap-4">
          <label class="grid gap-2 text-sm font-medium">
            Name
            <Input defaultValue="Margaret Welsh" />
          </label>
          <label class="grid gap-2 text-sm font-medium">
            Username
            <Input defaultValue="@maggie.welsh" />
          </label>
        </DialogPanel>
        <DialogFooter>
          <DialogClose class={buttonClass({ variant: "ghost" })} type="button">
            Cancel
          </DialogClose>
          <Button type="button">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
