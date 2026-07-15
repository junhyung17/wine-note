import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { searchWineCatalog, type WineCatalogEntry } from '../api/wineApi';

interface Props {
  onSelect: (entry: WineCatalogEntry) => void;
}

export default function WineSearchAutocomplete({ onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<WineCatalogEntry[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<WineCatalogEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(timer.current);
    if (query.trim().length < 2) { setResults([]); return; }
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchWineCatalog(query);
        setResults(data);
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer.current);
  }, [query]);

  function handleSelect(entry: WineCatalogEntry) {
    setSelected(entry);
    setQuery(`${entry.producer} ${entry.name}`);
    setOpen(false);
    onSelect(entry);
  }

  function googleSearchUrl() {
    if (!selected) return null;
    const q = encodeURIComponent(`${selected.producer} ${selected.name} winery official site`);
    return `https://www.google.com/search?q=${q}`;
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(null); }}
            onFocus={() => results.length > 0 && setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            placeholder="생산자 또는 와인명 검색..."
            className="w-full bg-[#1a0f13] border border-[#3d1f2a] rounded-lg pl-9 pr-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#8f1c39] transition-colors text-sm"
          />
          {loading && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">검색 중...</span>
          )}
        </div>

        {open && results.length > 0 && (
          <div className="absolute z-20 w-full mt-1 bg-[#1a0f13] border border-[#3d1f2a] rounded-xl shadow-2xl overflow-hidden">
            {results.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onMouseDown={() => handleSelect(entry)}
                className="w-full text-left px-4 py-3 hover:bg-[#2a1520] transition-colors border-b border-[#2a1520] last:border-0"
              >
                <p className="text-sm text-white font-medium">{entry.producer}</p>
                <p className="text-xs text-gray-400">{entry.name}</p>
                <p className="text-xs text-gray-600 mt-0.5">
                  {[entry.country, entry.region].filter(Boolean).join(' · ')}
                  {entry.grapes.length > 0 && ` · ${entry.grapes.join(', ')}`}
                </p>
              </button>
            ))}
          </div>
        )}

        {open && !loading && query.length >= 2 && results.length === 0 && (
          <div className="absolute z-20 w-full mt-1 bg-[#1a0f13] border border-[#3d1f2a] rounded-xl px-4 py-3">
            <p className="text-sm text-gray-500">검색 결과 없음 — 아래에 직접 입력하세요</p>
          </div>
        )}
      </div>

      {selected && googleSearchUrl() && (
        <a
          href={googleSearchUrl()!}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-[#d4af6a] hover:text-[#f0c878] transition-colors"
        >
          <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
          {selected.producer} 홈페이지 검색 (블렌딩 비율 확인)
        </a>
      )}
    </div>
  );
}
