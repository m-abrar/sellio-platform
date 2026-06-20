import React, { useState, useRef, useEffect } from 'react';
import { MapPin, X, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { searchLocations, LocationOption } from '../api/locationApi';

interface LocationPickerProps {
  displayValue: string;
  onSelect: (slug: string, title: string) => void;
  onClear: () => void;
  placeholder?: string;
  className?: string;
}

export function LocationPicker({
  displayValue,
  onSelect,
  onClear,
  placeholder = 'Search your location...',
  className,
}: LocationPickerProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<LocationOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await searchLocations(query);
        setResults(data);
        setIsOpen(data.length > 0);
        setHighlightedIndex(-1);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: LocationOption) => {
    onSelect(option.slug, option.title);
    setQuery('');
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleClear = () => {
    onClear();
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (displayValue && !val) {
      onClear();
    } else if (displayValue) {
      onClear();
    }
    setQuery(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelect(results[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
    }
  };

  const inputValue = displayValue && !query ? displayValue : query;
  const showClear = !!(displayValue || query);
  const showNoResults = isOpen && !isSearching && query.trim() && results.length === 0;

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        <MapPin
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
          size={18}
        />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-3 bg-zinc-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-zinc-900 transition-all placeholder-zinc-400"
        />
        {isSearching && (
          <Loader2
            size={14}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 animate-spin pointer-events-none"
          />
        )}
        {!isSearching && showClear && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-700 rounded-full transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-20 top-full mt-1 w-full bg-white rounded-2xl shadow-xl border border-zinc-100 overflow-hidden">
          {results.map((option, i) => (
            <button
              key={option.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(option)}
              className={cn(
                'w-full text-left px-4 py-3 flex items-center gap-3 transition-colors text-sm',
                highlightedIndex === i ? 'bg-zinc-50' : 'hover:bg-zinc-50',
              )}
            >
              <MapPin size={13} className="text-zinc-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-zinc-900 leading-tight">{option.title}</p>
                {option.subtitle && (
                  <p className="text-[11px] text-zinc-500 mt-0.5">{option.subtitle}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {showNoResults && (
        <div className="absolute z-20 top-full mt-1 w-full bg-white rounded-2xl shadow-xl border border-zinc-100 px-4 py-3 text-sm text-zinc-400">
          No locations found for "{query}".
        </div>
      )}
    </div>
  );
}
