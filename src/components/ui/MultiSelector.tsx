"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { TagOption } from "@/types/Tags";

interface MultiSelectorProps {
  options: TagOption[];
  selected: TagOption[];
  onSelectedChange: (selected: TagOption[]) => void;
  placeholder?: string;
}

export function MultiSelector({
  options,
  selected,
  onSelectedChange,
  placeholder = "Select relevant tags...",
}: MultiSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  // Debugging logs
  React.useEffect(() => {
    console.log("Options:", options);
    console.log("Search Term:", searchTerm);
    console.log("Filtered Options:", filteredOptions);
  }, [options, searchTerm, filteredOptions]);

  // Handler to toggle selection
  const handleSelect = (option: TagOption) => {
    if (selected.find((item) => item.value === option.value)) {
      // If already selected, remove it
      onSelectedChange(selected.filter((item) => item.value !== option.value));
    } else {
      // Else, add it
      onSelectedChange([...selected, option]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between flex-wrap gap-1" // Reduced gap
        >
          <div className="flex flex-wrap gap-1"> {/* Reduced gap */}
            {selected.length > 0 ? (
              selected.map((tag) => (
                <span
                  key={tag.value}
                  className="px-1 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium" // Smaller padding and font
                >
                  {tag.label}
                </span>
              ))
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0 z-50"
        side="bottom"
        align="start"
        sideOffset={4}
      >
        <Command>
          <CommandInput
            placeholder="Search tags..."
            value={searchTerm}
            onValueChange={(value) => {
              setSearchTerm(value);
              console.log("Updated Search Term:", value);
            }}
          />
          <CommandList>
            {filteredOptions.length === 0 && searchTerm !== "" ? (
              <CommandEmpty>No tags found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      handleSelect(option);
                      console.log("Option selected:", option.label);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected.find((item) => item.value === option.value)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
