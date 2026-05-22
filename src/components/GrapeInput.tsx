import { useState, type KeyboardEvent } from 'react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { GRAPE_VARIETIES, COLOR_TO_GRAPE_COLOR } from '../data/grapes';
import type { WineColor } from '../types/wine';

interface GrapeInputProps {
  grapes: string[];
  onChange: (grapes: string[]) => void;
  wineColor?: WineColor;
  country?: string;
}

const GRAPE_COLOR_LABEL: Record<string, string> = { red: '레드', white: '화이트', sparkling: '스파클링' };

export default function GrapeInput({ grapes, onChange, wineColor, country }: GrapeInputProps) {
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);

  const colorPriority = wineColor ? COLOR_TO_GRAPE_COLOR[wineColor] ?? ['red', 'white', 'sparkling'] : ['red', 'white', 'sparkling'];

  function score(g: (typeof GRAPE_VARIETIES)[0]) {
    const colorRank = colorPriority.indexOf(g.color);
    const countryMatch = country && g.countries.some(c => c.includes(country) || country.includes(c)) ? 0 : 1;
    return colorRank * 2 + countryMatch;
  }

  const sorted = [...GRAPE_VARIETIES].sort((a, b) => score(a) - score(b));

  const autocomplete = input
    ? sorted.filter(g => g.name.toLowerCase().includes(input.toLowerCase()) && !grapes.includes(g.name))
    : [];

  const quickPicks = sorted.filter(g => !grapes.includes(g.name));

  function add(name: string) {
    const t = name.trim();
    if (t && !grapes.includes(t)) onChange([...grapes, t]);
    setInput('');
    setOpen(false);
  }

  function remove(name: string) {
    onChange(grapes.filter(g => g !== name));
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if ((e.key === 'Enter' || e.key === ',') && input) {
      e.preventDefault();
      add(input);
    } else if (e.key === 'Backspace' && !input && grapes.length > 0) {
      remove(grapes[grapes.length - 1]);
    }
  }

  function highlight(name: string) {
    if (!input) return <>{name}</>;
    const idx = name.toLowerCase().indexOf(input.toLowerCase());
    if (idx === -1) return <>{name}</>;
    return (
      <>
        {name.slice(0, idx)}
        <span className="text-[#f4a8b8] font-medium">{name.slice(idx, idx + input.length)}</span>
        {name.slice(idx + input.length)}
      </>
    );
  }

  return (
    <div>
      <div className="relative">
        <div className="min-h-[48px] bg-[#1a0f13] border border-[#3d1f2a] rounded-lg p-2 flex flex-wrap gap-2 focus-within:border-[#8f1c39] transition-colors">
          {grapes.map((grape) => (
            <span key={grape} className="inline-flex items-center gap-1 bg-[#3d1f2a] text-[#f4a8b8] text-sm rounded-md px-2 py-0.5">
              {grape}
              <button type="button" onClick={() => remove(grape)} className="hover:text-white transition-colors">
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          ))}
          <input
            className="flex-1 min-w-[140px] bg-transparent outline-none text-sm text-white placeholder-gray-600"
            value={input}
            onChange={(e) => { setInput(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            onKeyDown={handleKey}
            placeholder={grapes.length === 0 ? 'Cabernet Sauvignon...' : ''}
          />
        </div>

        {/* 타이핑 자동완성 드롭다운 */}
        {open && input && autocomplete.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-[#1a0f13] border border-[#3d1f2a] rounded-lg shadow-xl max-h-52 overflow-y-auto">
            {autocomplete.slice(0, 10).map((g) => (
              <button
                key={g.name}
                type="button"
                onMouseDown={() => add(g.name)}
                className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-[#3d1f2a] hover:text-white transition-colors flex items-center justify-between"
              >
                <span>{highlight(g.name)}</span>
                <span className="text-xs text-gray-600 ml-2">
                  {GRAPE_COLOR_LABEL[g.color]} · {g.countries.slice(0, 2).join(', ')}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* 포커스 시 빠른 선택 */}
        {open && !input && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {quickPicks.slice(0, 24).map((g) => (
              <button
                key={g.name}
                type="button"
                onMouseDown={() => add(g.name)}
                className="text-xs bg-[#1a0f13] border border-[#3d1f2a] text-gray-400 rounded-md px-2 py-1 hover:border-[#8f1c39] hover:text-[#f4a8b8] transition-colors"
              >
                {g.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
