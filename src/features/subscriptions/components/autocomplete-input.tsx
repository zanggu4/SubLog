"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";

export interface AutocompleteOption {
  label: string;
  searchTerms: string[];
}

interface AutocompleteInputProps {
  name: string;
  required?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  defaultValue?: string;
  options: AutocompleteOption[];
  className?: string;
}

export function AutocompleteInput({
  name,
  required,
  autoFocus,
  placeholder,
  defaultValue = "",
  options,
  className = "",
}: AutocompleteInputProps) {
  const [value, setValue] = useState(defaultValue);
  const [filtered, setFiltered] = useState<AutocompleteOption[]>([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!value.trim()) {
      setFiltered([]);
      setIsOpen(false);
      return;
    }
    const query = value.toLowerCase();
    const matches = options.filter((opt) =>
      opt.searchTerms.some((term) => term.includes(query))
    );
    setFiltered(matches.slice(0, 8));
    setIsOpen(matches.length > 0);
    setHighlightIndex(-1);
  }, [value, options]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (highlightIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightIndex] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightIndex]);

  function handleKeyDown(e: KeyboardEvent) {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      e.preventDefault();
      selectOption(filtered[highlightIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  function selectOption(opt: AutocompleteOption) {
    setValue(opt.label);
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        name={name}
        required={required}
        autoFocus={autoFocus}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => {
          if (value.trim() && filtered.length > 0) setIsOpen(true);
        }}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-expanded={isOpen}
        aria-autocomplete="list"
        autoComplete="off"
        className={className}
      />
      {isOpen && filtered.length > 0 && (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute z-50 top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-xl max-h-64 overflow-y-auto"
        >
          {filtered.map((opt, i) => (
            <li
              key={opt.label}
              role="option"
              aria-selected={i === highlightIndex}
              onMouseDown={() => selectOption(opt)}
              onMouseEnter={() => setHighlightIndex(i)}
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                i === highlightIndex
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-background"
              }`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
