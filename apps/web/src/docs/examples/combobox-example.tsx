import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxListbox,
} from "@/components/ui/combobox";

export function Component() {
  const options = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Orange", value: "orange" },
    { label: "Grape", value: "grape" },
    { label: "Strawberry", value: "strawberry" },
    { label: "Mango", value: "mango" },
    { label: "Pineapple", value: "pineapple" },
    { label: "Kiwi", value: "kiwi" },
    { label: "Peach", value: "peach" },
    { label: "Pear", value: "pear" },
  ];

  return (
    <Combobox>
      <ComboboxInput aria-label="Select a fruit" class="w-64" placeholder="Select a fruit..." />
      <ComboboxContent>
        <ComboboxListbox>
          {options.map((option) => (
            <ComboboxItem value={option.value}>{option.label}</ComboboxItem>
          ))}
        </ComboboxListbox>
      </ComboboxContent>
    </Combobox>
  );
}
