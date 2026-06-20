import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, X, Loader2, Search } from 'lucide-react';
import { cn } from '../lib/utils';
import { searchLocations, LocationOption } from '../api/locationApi';

interface LocationPickerProps {
  displayValue: string;
  onSelect: (id: number, title: string) => void;
  onClear: () => void;
  placeholder?: string;
  className?: string;
}

export function LocationPicker({
  displayValue,
  onSelect,
  onClear,
  placeholder = 'Select your location...',
  className,
}: LocationPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
      setHighlightedIndex(-1);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await searchLocations(query);
        setResults(data);
        setHighlightedIndex(-1);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: LocationOption) => {
    onSelect(option.id, option.title);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClear();
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
    }
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Trigger — looks like a select field */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={cn(
          'w-full flex items-center gap-3 pl-4 pr-3 py-3 bg-zinc-50 rounded-2xl text-sm text-left transition-all',
          'focus:outline-none focus:ring-2 focus:ring-zinc-900',
          isOpen && 'ring-2 ring-zinc-900',
        )}
      >
        <MapPin size={18} className="text-zinc-400 shrink-0" />
        <span className={cn('flex-1 truncate', displayValue ? 'text-zinc-900' : 'text-zinc-400')}>
          {displayValue || placeholder}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          {displayValue && (
            <span
              role="button"
              onClick={handleClear}
              className="p-1 text-zinc-400 hover:text-zinc-700 rounded-full transition-colors"
            >
              <X size={14} />
            </span>
          )}
          <ChevronDown
            size={16}
            className={cn('text-zinc-400 transition-transform duration-200', isOpen && 'rotate-180')}
          />
        </div>
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute z-30 top-full mt-1 w-full bg-white rounded-2xl shadow-xl border border-zinc-100 overflow-hidden">
          {/* Search input inside dropdown */}
          <div className="p-2 border-b border-zinc-100">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search city, region..."
                className="w-full pl-8 pr-8 py-2 bg-zinc-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all placeholder-zinc-400"
              />
              {isSearching && (
                <Loader2 size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 animate-spin" />
              )}
            </div>
          </div>

          {/* Results list */}
          <div className="max-h-56 overflow-y-auto">
            {results.length > 0 ? (
              results.map((option, i) => (
                <button
                  key={option.id}
                  type="button"
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => handleSelect(option)}
                  className={cn(
                    'w-full text-left px-4 py-3 flex items-start gap-3 transition-colors text-sm',
                    highlightedIndex === i ? 'bg-zinc-100' : 'hover:bg-zinc-50',
                  )}
                >
                  <MapPin size={13} className="text-zinc-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-zinc-900 leading-tight">{option.title}</p>
                    {option.subtitle && (
                      <p className="text-[11px] text-zinc-500 mt-0.5">{option.subtitle}</p>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-sm text-zinc-400">
                {query.trim()
                  ? isSearching ? 'Searching...' : `No results for "${query}"`
                  : 'Start typing to search locations'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
