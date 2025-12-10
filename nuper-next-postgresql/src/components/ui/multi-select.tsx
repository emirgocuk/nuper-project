"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"

export type Option = {
    label: string
    value: string
}

interface MultiSelectProps {
    options: Option[] | string[]
    selected: string[]
    onChange: (selected: string[]) => void
    placeholder?: string
    className?: string
}

export function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = "Seçiniz...",
    className,
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false)

    // Normalize options to Option[]
    const normalizedOptions: Option[] = React.useMemo(() => {
        return options.map(opt =>
            typeof opt === 'string' ? { label: opt, value: opt } : opt
        )
    }, [options])

    const handleUnselect = (item: string) => {
        onChange(selected.filter((i) => i !== item))
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full justify-between h-auto min-h-10 hover:bg-background",
                        selected.length > 0 ? "h-auto" : "h-10",
                        className
                    )}
                >
                    <div className="flex flex-wrap gap-1">
                        {selected.length === 0 && (
                            <span className="text-muted-foreground font-normal">{placeholder}</span>
                        )}
                        {selected.map((item) => (
                            <Badge
                                variant="secondary"
                                key={item}
                                className="mr-1 mb-1"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleUnselect(item)
                                }}
                            >
                                {item}
                                <div
                                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleUnselect(item)
                                        }
                                    }}
                                    onMouseDown={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                    }}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        handleUnselect(item)
                                    }}
                                >
                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                </div>
                            </Badge>
                        ))}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 animate-in fade-in-0 zoom-in-95 duration-300 bg-white !bg-white" align="start">
                <Command className="bg-white !bg-white">
                    <CommandInput placeholder="Ara..." className="text-black !text-black placeholder:text-gray-500 !placeholder:text-gray-500" />
                    <CommandList>
                        <CommandEmpty className="text-gray-500 !text-gray-500">Sonuç bulunamadı.</CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-auto bg-white !bg-white">
                            {normalizedOptions.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    className="cursor-pointer text-black !text-black aria-selected:bg-blue-50 !aria-selected:bg-blue-50 aria-selected:text-black !aria-selected:text-black data-[disabled]:pointer-events-auto data-[disabled]:opacity-100 bg-white !bg-white hover:bg-gray-100 !hover:bg-gray-100"
                                    onSelect={() => {
                                        onChange(
                                            selected.includes(option.value)
                                                ? selected.filter((item) => item !== option.value)
                                                : [...selected, option.value]
                                        )
                                    }}
                                    onPointerDown={(e) => {
                                        e.preventDefault();
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4 text-nuper-blue !text-nuper-blue",
                                            selected.includes(option.value)
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
