import { useState, type KeyboardEvent } from 'react';
import { XMarkIcon } from '@heroicons/react/20/solid';

interface TagInputProps {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
}

export default function TagInput({ label, tags, onChange, suggestions = [], placeholder }: TagInputProps) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filtered = suggestions.filter(
    (s) => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)
  );

  function addTag(tag: string) {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput('');
    setShowSuggestions(false);
  }

  function removeTag(tag: string) {
    onChange(tags.filter((t) => t !== tag));
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <div className="relative">
        <div className="min-h-[48px] bg-[#1a0f13] border border-[#3d1f2a] rounded-lg p-2 flex flex-wrap gap-2 focus-within:border-[#8f1c39] transition-colors">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 bg-[#3d1f2a] text-[#f4a8b8] text-sm rounded-md px-2 py-0.5"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-white transition-colors"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          ))}
          <input
            className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-white placeholder-gray-600"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onKeyDown={handleKey}
            placeholder={tags.length === 0 ? (placeholder ?? '입력 후 Enter') : ''}
          />
        </div>

        {showSuggestions && input && filtered.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-[#1a0f13] border border-[#3d1f2a] rounded-lg shadow-xl max-h-48 overflow-y-auto scrollbar-hide">
            {filtered.slice(0, 12).map((s) => (
              <button
                key={s}
                type="button"
                onMouseDown={() => addTag(s)}
                className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-[#3d1f2a] hover:text-white transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {showSuggestions && !input && suggestions.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {suggestions
              .filter((s) => !tags.includes(s))
              .slice(0, 16)
              .map((s) => (
                <button
                  key={s}
                  type="button"
                  onMouseDown={() => addTag(s)}
                  className="text-xs bg-[#1a0f13] border border-[#3d1f2a] text-gray-400 rounded-md px-2 py-1 hover:border-[#8f1c39] hover:text-[#f4a8b8] transition-colors"
                >
                  {s}
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
