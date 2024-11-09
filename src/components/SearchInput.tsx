import React from 'react';
import { Search } from 'lucide-react';
import TypeAnimation from './TypeAnimation';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  disabled?: boolean;
}

export function SearchInput({ value, onChange, onSearch, disabled }: SearchInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex h-[66px] w-full items-center justify-between rounded-full bg-white/10 px-6 search-glow backdrop-blur-md border border-white/20 transition-all hover:bg-white/15"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Unleash your curiosity, explore the extraordinary..."
        disabled={disabled}
        className="my-1 w-full text-lg font-light text-white outline-none bg-transparent placeholder:text-white/50 focus-visible:ring-0 focus-visible:ring-offset-0"
        required
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="relative flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all hover:from-pink-600 hover:to-purple-700 disabled:opacity-75 ml-2"
      >
        {disabled ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <TypeAnimation />
          </div>
        ) : (
          <Search className="w-6 h-6 text-white" />
        )}
      </button>
    </form>
  );
}