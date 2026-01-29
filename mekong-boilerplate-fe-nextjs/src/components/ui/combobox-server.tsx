'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useDebounce } from '@/lib/hooks/use-debounce'

interface ComboboxServerProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  searchPlaceholder: string
  emptyMessage: string
  disabled?: boolean
  className?: string
  onSearch: (query: string) => void
  options: { value: string; label: string }[]
  isLoading?: boolean
}

export function ComboboxServer({
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  disabled = false,
  className,
  onSearch,
  options,
  isLoading = false,
}: ComboboxServerProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Effect to trigger search when debounced query changes
  React.useEffect(() => {
    if (open) {
      onSearch(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, open, onSearch]);

  // Get the selected option label
  const selectedLabel = React.useMemo(() => {
    if (!value) return placeholder;
    const option = options.find(opt => opt.value === value);
    return option ? option.label : placeholder;
  }, [value, options, placeholder]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("w-full justify-between", className)}
        >
          {selectedLabel}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[200px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="h-9"
          />
          <CommandList>
            {isLoading ? (
              <div className="py-6 text-center text-sm">Loading...</div>
            ) : (
              <>
                <CommandEmpty>{emptyMessage}</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => {
                        // Directly use option.value instead of currentValue
                        onChange(option.value === value ? "" : option.value)
                        setOpen(false)
                      }}
                      className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === option.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span className="font-normal text-foreground">{option.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
