import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function Component() {
  return (
    <RadioGroup
      defaultValue="email"
      class="w-fit max-w-full rounded-lg border bg-card p-4 shadow-xs"
    >
      <RadioGroupItem value="email">Email notifications</RadioGroupItem>
      <RadioGroupItem value="sms">SMS notifications</RadioGroupItem>
      <RadioGroupItem value="none">No notifications</RadioGroupItem>
    </RadioGroup>
  );
}
