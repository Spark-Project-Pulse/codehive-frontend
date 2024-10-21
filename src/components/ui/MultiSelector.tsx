// made this file name capitalized since making it lowercase was messing with the import for some reason

"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { TagOption } from "@/types/Tags"

interface MultiSelectorProps {
  options: TagOption[]
  selected: TagOption[]
  onSelectedChange: (selected: TagOption[]) => void
  placeholder?: string
}

export function MultiSelector({
  options,
  selected,
  onSelectedChange,
  placeholder = "Select relevant tags...",
}: MultiSelectorProps) {
  const [open, setOpen] = React.useState(false)

  // Handler to toggle selection
  const handleSelect = (option: TagOption) => {
    if (selected.find((item) => item.value === option.value)) {
      // If already selected, remove it
      onSelectedChange(selected.filter((item) => item.value !== option.value))
    } else {
      // Else, add it
      onSelectedChange([...selected, option])
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex flex-wrap gap-2">
            {selected.length > 0 ? (
              selected.map((tag) => (
                <span
                  key={tag.value}
                  className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium"
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
        className="w-full p-0"
        side="bottom"
        align="start"
        sideOffset={4}
      >
        <Command>
          <CommandInput placeholder="Search tags..." />
          <CommandEmpty>No tags found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
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
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
