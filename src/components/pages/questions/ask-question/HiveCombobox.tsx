'use client'

import { useEffect, useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Check, ChevronsUpDown } from 'lucide-react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { type HiveOption } from '@/types/Hives'
import { getAllHiveOptions } from '@/api/hives'

interface HiveComboboxProps {
  defaultValue: string
  onChange: (value: string) => void
}

export default function HiveCombobox({
  defaultValue,
  onChange,
}: HiveComboboxProps) {
  const [hiveOptions, setHiveOptions] = useState<HiveOption[]>(
    []
  )
  const [filteredHiveOptions, setFilteredHiveOptions] = useState<
    HiveOption[]
  >([])
  const [hiveSelectOpen, setHiveSelectOpen] = useState<boolean>(false)
  const [hiveLabel, setHiveLabel] = useState<string>('')

  useEffect(() => {
    const fetchHives = async () => {
      const options = await getAllHiveOptions()
      setHiveOptions(options)
      setFilteredHiveOptions(options)
    }
    void fetchHives()
  }, [])

  useEffect(() => {
    const selectedOption = hiveOptions.find(
      (option) => option.value === defaultValue
    )
    if (selectedOption) {
      setHiveLabel(selectedOption.label)
    }
  }, [defaultValue, hiveOptions])

  const handleSelectHive = (option: HiveOption) => {
    if (defaultValue === option.value) {
      onChange('')
      setHiveLabel('')
    } else {
      onChange(option.value)
      setHiveLabel(option.label)
    }
    setHiveSelectOpen(false)
    setFilteredHiveOptions(hiveOptions)
  }

  return (
    <Popover open={hiveSelectOpen} onOpenChange={setHiveSelectOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={hiveSelectOpen}
          className="w-full justify-start"
        >
          <ChevronsUpDown className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          {hiveLabel || 'Select hive...'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search hive..."
            onValueChange={(inputValue) => {
              setFilteredHiveOptions(
                hiveOptions.filter((option) =>
                  option.label.toLowerCase().includes(inputValue.toLowerCase())
                )
              )
            }}
          />
          <CommandList>
            <CommandEmpty>No hive found.</CommandEmpty>
            <CommandGroup>
              {filteredHiveOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelectHive(option)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      defaultValue === option.value ? 'opacity-100' : 'opacity-0'
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
