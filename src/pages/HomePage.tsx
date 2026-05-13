import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, MagnifyingGlassIcon, Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline';
import { type WineNote, type WineColor, COLOR_LABELS } from '../types/wine';
import { getWines } from '../store/wineStore';
import WineColorBadge from '../components/WineColorBadge';
import StarRating from '../components/StarRating';

type ViewMode = 'grid' | 'list';
const ALL_COLORS: (WineColor | 'all')[] = ['all', 'red', 'white', 'rosé', 'sparkling', 'orange', 'dessert', 'fortified'];

function formatPrice(price: string, currency: string) {
  if (!price) return null;
  const num = Number(price.replace(/,/g, ''));
  if (isNaN(num)) return price;
  if (currency === 'KRW') return `₩${num.toLocaleString()}`;
  if (currency === 'USD') return `$${num.toLocaleString()}`;
  if (currency === 'EUR') return `€${num.toLocaleString()}`;
  if (currency === 'JPY') return `¥${num.toLocaleString()}`;
  return price;
}

function WineCard({ wine, onClick }: { wine: WineNote; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-[#140c0f] border border-[#2a1520] rounded-xl overflow-hidden cursor-pointer hover:border-[#5c2035] hover:bg-[#1a0f13] transition-all group"
    >
      {/* 사진 */}
      <div className="aspect-[4/3] bg-[#0f0a0c] relative overflow-hidden">
        {wine.photos[0] ? (
          <img
            src={wine.photos[0]}
            alt={wine.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl opacity-40">🍷</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <WineColorBadge color={wine.color} size="sm" />
        </div>
      </div>

      {/* 정보 */}
      <div className="p-3 space-y-1.5">
        <div>
          {wine.producer && (
            <p className="text-xs text-gray-500 truncate">{wine.producer}</p>
          )}
          <p className="font-semibold text-white text-sm truncate">
            {wine.name} {wine.vintage && <span className="text-[#d4af6a]">{wine.vintage}</span>}
          </p>
          {wine.region && (
            <p className="text-xs text-gray-500 truncate">{[wine.country, wine.region].filter(Boolean).join(' · ')}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          {wine.myRating > 0 ? (
            <StarRating value={wine.myRating} readonly size="sm" />
          ) : (
            <span className="text-xs text-gray-600">미평가</span>
          )}
          {wine.price && (
            <span className="text-xs text-[#d4af6a]">{formatPrice(wine.price, wine.currency)}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function WineRow({ wine, onClick }: { wine: WineNote; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 bg-[#140c0f] border border-[#2a1520] rounded-xl p-3 cursor-pointer hover:border-[#5c2035] hover:bg-[#1a0f13] transition-all"
    >
      <div className="w-14 h-14 bg-[#0f0a0c] rounded-lg overflow-hidden flex-shrink-0">
        {wine.photos[0] ? (
          <img src={wine.photos[0]} alt={wine.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">🍷</div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-white text-sm truncate">
            {wine.producer && `${wine.producer} `}{wine.name}
          </span>
          {wine.vintage && <span className="text-[#d4af6a] text-sm">{wine.vintage}</span>}
          <WineColorBadge color={wine.color} size="sm" />
        </div>
        <p className="text-xs text-gray-500 mt-0.5">
          {[wine.country, wine.region].filter(Boolean).join(' · ')}
          {wine.grape && ` · ${wine.grape}`}
        </p>
        {wine.nose.length > 0 && (
          <p className="text-xs text-gray-600 mt-0.5 truncate">{wine.nose.join(', ')}</p>
        )}
      </div>

      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        {wine.myRating > 0 && <StarRating value={wine.myRating} readonly size="sm" />}
        {wine.price && (
          <span className="text-xs text-[#d4af6a]">{formatPrice(wine.price, wine.currency)}</span>
        )}
        <span className="text-xs text-gray-600">
          {new Date(wine.dateTasted).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
        </span>
      </div>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [wines, setWines] = useState<WineNote[]>([]);
  const [search, setSearch] = useState('');
  const [filterColor, setFilterColor] = useState<WineColor | 'all'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'vintage'>('date');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getWines().then(setWines).catch(console.error);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchMatches = search
    ? wines.filter((w) => {
        const q = search.toLowerCase();
        return (
          w.name.toLowerCase().includes(q) ||
          w.producer.toLowerCase().includes(q) ||
          w.region.toLowerCase().includes(q) ||
          w.country.toLowerCase().includes(q) ||
          w.grape.toLowerCase().includes(q)
        );
      })
    : wines;

  const filtered = searchMatches
    .filter((w) => filterColor === 'all' || w.color === filterColor)
    .sort((a, b) => {
      if (sortBy === 'rating') return b.myRating - a.myRating;
      if (sortBy === 'vintage') return (b.vintage || '0').localeCompare(a.vintage || '0');
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const dropdownResults = search ? searchMatches.slice(0, 6) : [];

  return (
    <div className="min-h-screen bg-[#0f0a0c]">
      {/* 헤더 */}
      <header className="sticky top-0 z-20 bg-[#0f0a0c]/95 backdrop-blur border-b border-[#2a1520] px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                🍷 <span className="text-[#d4af6a]">Vin</span>Note
              </h1>
              <p className="text-xs text-gray-500">{wines.length}개의 와인 기록</p>
            </div>
            <button
              onClick={() => navigate('/add')}
              className="flex items-center gap-1.5 bg-[#8f1c39] hover:bg-[#ab1e3f] text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              기록 추가
            </button>
          </div>

          {/* 검색 */}
          <div className="relative" ref={searchRef}>
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onKeyDown={(e) => e.key === 'Escape' && setSearchFocused(false)}
              placeholder="와인 이름, 생산자, 지역으로 검색..."
              className="w-full bg-[#1a0f13] border border-[#3d1f2a] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#8f1c39] transition-colors"
            />
            {/* 검색 드롭다운 */}
            {searchFocused && dropdownResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a0f13] border border-[#3d1f2a] rounded-xl shadow-2xl z-30 overflow-hidden">
                {dropdownResults.map((wine) => (
                  <div
                    key={wine.id}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      navigate(`/wine/${wine.id}`);
                      setSearchFocused(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#2a1520] cursor-pointer transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-[#0f0a0c]">
                      {wine.photos[0] ? (
                        <img src={wine.photos[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-base">🍷</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">
                        {wine.name}
                        {wine.vintage && <span className="text-[#d4af6a] ml-1.5">{wine.vintage}</span>}
                      </p>
                      {(wine.producer || wine.region) && (
                        <p className="text-xs text-gray-500 truncate">
                          {[wine.producer, wine.country, wine.region].filter(Boolean).join(' · ')}
                        </p>
                      )}
                    </div>
                    <WineColorBadge color={wine.color} size="sm" />
                  </div>
                ))}
                {searchMatches.length > 6 && (
                  <div className="px-3 py-2 border-t border-[#2a1520] text-xs text-gray-500 text-center">
                    전체 {searchMatches.length}개 결과 보기 ↓
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 pt-4 pb-8">
        {/* 필터 & 뷰 컨트롤 */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
          {ALL_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setFilterColor(c)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                filterColor === c
                  ? 'bg-[#8f1c39] text-white'
                  : 'bg-[#1a0f13] text-gray-400 border border-[#3d1f2a] hover:border-[#8f1c39]'
              }`}
            >
              {c === 'all' ? '전체' : COLOR_LABELS[c]}
            </button>
          ))}
          <div className="flex-1" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="flex-shrink-0 bg-[#1a0f13] border border-[#3d1f2a] rounded-lg px-2 py-1 text-xs text-gray-400 focus:outline-none focus:border-[#8f1c39]"
          >
            <option value="date">최신순</option>
            <option value="rating">평점순</option>
            <option value="vintage">빈티지순</option>
          </select>
          <div className="flex-shrink-0 flex border border-[#3d1f2a] rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 ${viewMode === 'grid' ? 'bg-[#3d1f2a] text-white' : 'text-gray-500 hover:text-gray-300'} transition-colors`}
            >
              <Squares2X2Icon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 ${viewMode === 'list' ? 'bg-[#3d1f2a] text-white' : 'text-gray-500 hover:text-gray-300'} transition-colors`}
            >
              <ListBulletIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 와인 목록 */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-6xl mb-4">🍾</span>
            {wines.length === 0 ? (
              <>
                <p className="text-white font-semibold mb-1">첫 와인을 기록해보세요</p>
                <p className="text-gray-500 text-sm mb-6">마신 와인을 기록하고 테이스팅 노트를 남겨보세요.</p>
                <button
                  onClick={() => navigate('/add')}
                  className="flex items-center gap-2 bg-[#8f1c39] hover:bg-[#ab1e3f] text-white px-5 py-2.5 rounded-xl transition-colors text-sm font-medium"
                >
                  <PlusIcon className="w-4 h-4" />
                  첫 와인 기록하기
                </button>
              </>
            ) : (
              <p className="text-gray-500 text-sm">검색 결과가 없습니다.</p>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filtered.map((wine) => (
              <WineCard key={wine.id} wine={wine} onClick={() => navigate(`/wine/${wine.id}`)} />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((wine) => (
              <WineRow key={wine.id} wine={wine} onClick={() => navigate(`/wine/${wine.id}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
