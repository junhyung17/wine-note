import { useState } from 'react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/20/solid';
import { GRAPE_VARIETIES } from '../data/grapes';
import type { GrapeBlend, WineColor } from '../types/wine';

interface Props {
  grapes: GrapeBlend[];
  onChange: (grapes: GrapeBlend[]) => void;
  wineColor?: WineColor;
}

export default function GrapeBlendInput({ grapes, onChange, wineColor }: Props) {
  const [input, setInput] = useState('');
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const total = grapes.reduce((s, g) => s + (g.percentage ?? 0), 0);

  const suggestions = input.length >= 1
    ? GRAPE_VARIETIES
        .filter(g => g.name.toLowerCase().includes(input.toLowerCase()) && !grapes.some(e => e.name === g.name))
        .slice(0, 8)
    : [];

  function addGrape(name: string) {
    if (!name.trim() || grapes.some(g => g.name === name)) return;
    onChange([...grapes, { name: name.trim(), percentage: null }]);
    setInput('');
    setActiveIdx(null);
  }

  function removeGrape(idx: number) {
    onChange(grapes.filter((_, i) => i !== idx));
  }

  function setPercentage(idx: number, val: string) {
    const num = val === '' ? null : Math.min(100, Math.max(0, Number(val)));
    onChange(grapes.map((g, i) => i === idx ? { ...g, percentage: isNaN(num as number) ? null : num } : g));
  }

  return (
    <div className="space-y-2">
      {/* 추가된 품종 목록 */}
      {grapes.length > 0 && (
        <div className="space-y-2">
          {grapes.map((g, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="flex-1 text-sm text-white bg-[#1a0f13] border border-[#3d1f2a] rounded-lg px-3 py-2">
                {g.name}
              </span>
              <div className="relative flex items-center">
                <input
                  type="number"
                  value={g.percentage ?? ''}
                  onChange={(e) => setPercentage(idx, e.target.value)}
                  placeholder="—"
                  min="0"
                  max="100"
                  className="w-16 bg-[#1a0f13] border border-[#3d1f2a] rounded-lg px-2 py-2 text-sm text-white text-center focus:outline-none focus:border-[#8f1c39] transition-colors"
                />
                <span className="absolute right-2 text-xs text-gray-600 pointer-events-none">%</span>
              </div>
              <button
                type="button"
                onClick={() => removeGrape(idx)}
                className="p-1.5 text-gray-600 hover:text-red-400 transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
          {/* 비율 합계 */}
          {total > 0 && (
            <div className={`text-xs text-right pr-10 ${total === 100 ? 'text-green-500' : total > 100 ? 'text-red-400' : 'text-gray-500'}`}>
              합계: {total}%{total === 100 ? ' ✓' : ''}
            </div>
          )}
        </div>
      )}

      {/* 품종 추가 입력 */}
      <div className="relative">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => { setInput(e.target.value); setActiveIdx(null); }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && input) { e.preventDefault(); addGrape(input); }
            }}
            onBlur={() => setTimeout(() => setInput(''), 150)}
            placeholder="품종 추가 (예: Cabernet Sauvignon)"
            className="flex-1 bg-[#1a0f13] border border-[#3d1f2a] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#8f1c39] transition-colors"
          />
          <button
            type="button"
            onClick={() => addGrape(input)}
            disabled={!input.trim()}
            className="px-3 py-2 bg-[#1a0f13] border border-[#3d1f2a] rounded-lg text-gray-400 hover:text-white hover:border-[#8f1c39] disabled:opacity-30 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>

        {/* 자동완성 드롭다운 */}
        {suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-[#1a0f13] border border-[#3d1f2a] rounded-lg shadow-xl overflow-hidden">
            {suggestions.map((g) => (
              <button
                key={g.name}
                type="button"
                onMouseDown={() => addGrape(g.name)}
                className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-[#3d1f2a] hover:text-white transition-colors"
              >
                {g.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 빠른 선택 */}
      {!input && grapes.length === 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {GRAPE_VARIETIES
            .filter(g => !wineColor || (wineColor === 'red' ? g.color === 'red' : wineColor === 'white' ? g.color === 'white' : true))
            .slice(0, 16)
            .map((g) => (
              <button
                key={g.name}
                type="button"
                onClick={() => addGrape(g.name)}
                className="text-xs bg-[#1a0f13] border border-[#3d1f2a] text-gray-400 rounded-md px-2 py-1 hover:border-[#8f1c39] hover:text-[#f4a8b8] transition-colors"
              >
                {g.name}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
