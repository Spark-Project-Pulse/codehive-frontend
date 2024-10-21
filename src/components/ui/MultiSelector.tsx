"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
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
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // For dynamic maxVisibleTags calculation
  const [maxVisibleTags, setMaxVisibleTags] = useState<number>(3);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  // Reset searchTerm when the popover closes
  useEffect(() => {
    if (!open) {
      setSearchTerm("");
    }
  }, [open]);

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

  // Use ResizeObserver to adjust maxVisibleTags based on available width
  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    // Function to calculate maxVisibleTags based on container width
    const calculateMaxVisibleTags = () => {
      const containerWidth = container.offsetWidth;
      const tagWidth = 80; // Approximate width of a tag, adjust as needed
      const chevronWidth = 24; // Width of the ChevronsUpDown icon
      const padding = 16; // Total horizontal padding, adjust if needed

      // Calculate the number of tags that can fit
      const availableWidth = containerWidth - chevronWidth - padding;
      const newMaxVisibleTags = Math.max(
        1,
        Math.floor(availableWidth / tagWidth)
      );

      setMaxVisibleTags(newMaxVisibleTags);
    };

    // Create a ResizeObserver to observe size changes
    const resizeObserver = new ResizeObserver(() => {
      calculateMaxVisibleTags();
    });

    // Start observing the container
    resizeObserver.observe(container);

    // Initial calculation
    calculateMaxVisibleTags();

    // Cleanup function
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full max-w-full justify-between gap-1 overflow-hidden"
        >
          <div
            ref={containerRef}
            className="flex flex-1 items-center gap-1 overflow-hidden"
          >
            {selected.length > 0 ? (
              <>
                {selected.slice(0, maxVisibleTags).map((tag) => (
                  <span
                    key={tag.value}
                    className="px-1 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium flex-shrink-0"
                  >
                    {tag.label}
                  </span>
                ))}
                {selected.length > maxVisibleTags && (
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    +{selected.length - maxVisibleTags} more
                  </span>
                )}
              </>
            ) : (
              <span className="text-gray-500 truncate">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0 z-50"
        side="bottom"
        align="start"
        sideOffset={4}
        avoidCollisions={true}
        collisionPadding={10}
      >
        <Command>
          <CommandInput
            placeholder="Search tags..."
            value={searchTerm}
            onValueChange={(value) => {
              setSearchTerm(value);
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
                    onSelect={() => handleSelect(option)}
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
          {/* Adjust padding at the bottom */}
          <div className="p-2" />
        </Command>
      </PopoverContent>
    </Popover>
  );
}
