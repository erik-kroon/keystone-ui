import { CalendarDays } from "lucide-solid";
import { DatePicker, DatePickerContent, DatePickerTrigger } from "@/components/ui/date-picker";

export function Component() {
  return (
    <DatePicker defaultMonth="2026-05" defaultValue="2026-05-15">
      <DatePickerTrigger placeholder="Select date">
        <span>2026-05-15</span>
        <CalendarDays class="size-4 opacity-70" />
      </DatePickerTrigger>
      <DatePickerContent />
    </DatePicker>
  );
}
