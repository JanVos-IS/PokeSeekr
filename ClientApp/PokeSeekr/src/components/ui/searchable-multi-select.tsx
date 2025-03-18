import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

interface SearchableMultiSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: string[];
  allOptionLabel?: string;
  allOptionValue?: string;
  className?: string;
}

export function SearchableMultiSelect({
  value,
  onValueChange,
  placeholder,
  options,
  allOptionLabel = "All options",
  allOptionValue = "all",
  className,
}: SearchableMultiSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={onValueChange}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={allOptionValue}>{allOptionLabel}</SelectItem>
        {options.map((option, index) => (
          <SelectItem key={`option-${option}-${index}`} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 