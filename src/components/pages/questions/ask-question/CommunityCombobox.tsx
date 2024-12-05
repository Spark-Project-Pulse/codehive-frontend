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
import { type CommunityOption } from '@/types/Communities'
import { getAllCommunityOptions } from '@/api/communities'

interface CommunityComboboxProps {
  defaultValue: string
  onChange: (value: string) => void
}

export default function CommunityCombobox({
  defaultValue,
  onChange,
}: CommunityComboboxProps) {
  const [communityOptions, setCommunityOptions] = useState<CommunityOption[]>(
    []
  )
  const [filteredCommunityOptions, setFilteredCommunityOptions] = useState<
    CommunityOption[]
  >([])
  const [communitySelectOpen, setCommunitySelectOpen] = useState<boolean>(false)
  const [communityLabel, setCommunityLabel] = useState<string>('')

  useEffect(() => {
    const fetchCommunities = async () => {
      const options = await getAllCommunityOptions()
      setCommunityOptions(options)
      setFilteredCommunityOptions(options)
    }
    void fetchCommunities()
  }, [])

  useEffect(() => {
    const selectedOption = communityOptions.find(
      (option) => option.value === defaultValue
    )
    if (selectedOption) {
      setCommunityLabel(selectedOption.label)
    }
  }, [defaultValue, communityOptions])

  const handleSelectCommunity = (option: CommunityOption) => {
    if (defaultValue === option.value) {
      onChange('')
      setCommunityLabel('')
    } else {
      onChange(option.value)
      setCommunityLabel(option.label)
    }
    setCommunitySelectOpen(false)
    setFilteredCommunityOptions(communityOptions)
  }

  return (
    <Popover open={communitySelectOpen} onOpenChange={setCommunitySelectOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={communitySelectOpen}
          className="w-full justify-start !text-p13 text-muted-foreground"
        >
          {communityLabel || 'Select community (optional)'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search community..."
            onValueChange={(inputValue) => {
              setFilteredCommunityOptions(
                communityOptions.filter((option) =>
                  option.label.toLowerCase().includes(inputValue.toLowerCase())
                )
              )
            }}
          />
          <CommandList>
            <CommandEmpty>No community found.</CommandEmpty>
            <CommandGroup>
              {filteredCommunityOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelectCommunity(option)}
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
