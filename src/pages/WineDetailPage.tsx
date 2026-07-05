import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, PencilIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import {
  type WineNote,
  SWEETNESS_OPTIONS, ACIDITY_OPTIONS, TANNIN_OPTIONS, ALCOHOL_OPTIONS,
  BODY_OPTIONS, FLAVOUR_INTENSITY_OPTIONS, QUALITY_OPTIONS,
} from '../types/wine';
import { fetchWine, deleteWine } from '../api/wineApi';
import WineColorBadge from '../components/WineColorBadge';

function InfoItem({ label, value }: { label: string; value: string | number | undefined }) {
  if (!value && value !== 0) return null;
  return (
    <div>
      <dt className="text-xs text-gray-500 mb-0.5">{label}</dt>
      <dd className="text-sm text-white">{value}</dd>
    </div>
  );
}

function TagList({ tags, label }: { tags: string[]; label: string }) {
  if (!tags.length) return null;
  return (
    <div>
      <p className="text-xs text-gray-500 mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span key={t} className="bg-[#1a0f13] border border-[#3d1f2a] text-gray-300 text-xs rounded-md px-2.5 py-1">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-semibold text-[#d4af6a] border-b border-[#2a1520] pb-2 mb-3">
      {children}
    </h2>
  );
}

function ScaleRow<T extends string>({
  label,
  value,
  options,
}: {
  label: string;
  value: T | '';
  options: { value: T; label: string }[];
}) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-28 shrink-0">{label}</span>
      <div className="flex gap-1.5">
        {options.map((opt) => (
          <span
            key={opt.value}
            className={`text-xs px-2 py-1 rounded-md border transition-all ${
              opt.value === value
                ? 'bg-[#8f1c39] text-white border-[#cc2a4e]'
                : 'bg-[#0f0a0c] text-gray-600 border-[#2a1520]'
            }`}
          >
            {opt.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function WineDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [wine, setWine] = useState<WineNote | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      fetchWine(Number(id)).then(setWine).catch(() => setWine(null));
    }
  }, [id]);

  if (!wine) {
    return (
      <div className="min-h-screen bg-[#0f0a0c] flex items-center justify-center">
        <p className="text-gray-500">와인을 찾을 수 없습니다.</p>
      </div>
    );
  }

  function handleDelete() {
    if (!id) return;
    deleteWine(Number(id)).then(() => navigate('/'));
  }

  function formatPrice(price: string, currency: string) {
    if (!price) return '';
    const num = Number(price.replace(/,/g, ''));
    if (isNaN(num)) return price;
    if (currency === 'KRW') return `₩${num.toLocaleString()}`;
    if (currency === 'USD') return `$${num.toLocaleString()}`;
    if (currency === 'EUR') return `€${num.toLocaleString()}`;
    if (currency === 'JPY') return `¥${num.toLocaleString()}`;
    return price;
  }

  const hasStructure = wine.sweetness || wine.acidity || wine.tannin || wine.alcoholLevel || wine.body || wine.flavourIntensity;
  const hasAppearanceDetail = wine.appearanceIntensity || wine.appearanceColor || wine.appearance;
  const hasNose = wine.noseIntensity || wine.nose.length > 0;
  const hasTasting = hasAppearanceDetail || hasNose || wine.palate.length > 0 || wine.finish || wine.finishLength;
  const hasQuality = wine.quality || wine.ageing;

  const qualityLabel = wine.quality
    ? QUALITY_OPTIONS.find((q) => q.value === wine.quality)?.label
    : undefined;

  return (
    <div className="min-h-screen bg-[#0f0a0c]">
      {/* 헤더 */}
      <header className="sticky top-0 z-20 bg-[#0f0a0c]/95 backdrop-blur border-b border-[#2a1520] px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-[#1a0f13] text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 truncate">{wine.producer}</p>
          <p className="text-base font-semibold text-white truncate">
            {wine.name} {wine.vintage && <span className="text-[#d4af6a]">{wine.vintage}</span>}
          </p>
        </div>
        <button
          onClick={() => navigate(`/edit/${wine.id}`)}
          className="p-2 rounded-lg hover:bg-[#1a0f13] text-gray-400 hover:text-white transition-colors"
        >
          <PencilIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="p-2 rounded-lg hover:bg-[#1a0f13] text-gray-400 hover:text-red-400 transition-colors"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-6">
        {/* 사진 갤러리 */}
        {wine.photos.length > 0 && (
          <div className="relative rounded-xl overflow-hidden aspect-[16/9] bg-[#0f0a0c]">
            <img
              src={wine.photos[photoIndex]}
              alt={wine.name}
              className="w-full h-full object-cover"
            />
            {wine.photos.length > 1 && (
              <>
                <button
                  onClick={() => setPhotoIndex((i) => (i - 1 + wine.photos.length) % wine.photos.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/70"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setPhotoIndex((i) => (i + 1) % wine.photos.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/70"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {wine.photos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPhotoIndex(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${i === photoIndex ? 'bg-white' : 'bg-white/40'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* 기본 정보 */}
        <section className="bg-[#140c0f] border border-[#2a1520] rounded-xl p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              {wine.producer && <p className="text-sm text-gray-400">{wine.producer}</p>}
              <h1 className="text-xl font-bold text-white">
                {wine.name} {wine.vintage && <span className="text-[#d4af6a]">{wine.vintage}</span>}
              </h1>
            </div>
            <WineColorBadge color={wine.color} />
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
            <InfoItem label="국가" value={wine.country} />
            <InfoItem label="지역" value={wine.region} />
            <InfoItem label="포도 품종" value={wine.grape.join(', ')} />
            {wine.abv != null && <InfoItem label="알코올 도수" value={`${wine.abv}%`} />}
            <InfoItem label="시음일" value={wine.dateTasted ? new Date(wine.dateTasted).toLocaleDateString('ko-KR') : undefined} />
          </dl>
        </section>

        {/* 테이스팅 노트 */}
        {hasTasting && (
          <section className="bg-[#140c0f] border border-[#2a1520] rounded-xl p-4 space-y-4">
            <SectionTitle>테이스팅 노트</SectionTitle>

            {hasAppearanceDetail && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500">외관</p>
                {wine.appearanceIntensity && (
                  <span className="inline-block text-xs px-2.5 py-1 rounded-md bg-[#1a0f13] border border-[#3d1f2a] text-gray-300 mr-2">
                    강도: {wine.appearanceIntensity}
                  </span>
                )}
                {wine.appearanceColor && (
                  <span className="inline-block text-xs px-2.5 py-1 rounded-md bg-[#1a0f13] border border-[#3d1f2a] text-gray-300 mr-2">
                    {wine.appearanceColor}
                  </span>
                )}
                {wine.appearance && <p className="text-sm text-white mt-1">{wine.appearance}</p>}
              </div>
            )}

            {hasNose && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500">향 (아로마/부케)</p>
                {wine.noseIntensity && (
                  <span className="inline-block text-xs px-2.5 py-1 rounded-md bg-[#1a0f13] border border-[#3d1f2a] text-gray-300 mr-2">
                    강도: {wine.noseIntensity}
                  </span>
                )}
                {wine.nose.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {wine.nose.map((t) => (
                      <span key={t} className="bg-[#1a0f13] border border-[#3d1f2a] text-gray-300 text-xs rounded-md px-2.5 py-1">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <TagList tags={wine.palate} label="맛 (팔레트)" />

            {(wine.finish || wine.finishLength) && (
              <div className="space-y-1">
                <p className="text-xs text-gray-500">여운</p>
                {wine.finishLength && (
                  <span className="inline-block text-xs px-2.5 py-1 rounded-md bg-[#1a0f13] border border-[#3d1f2a] text-gray-300 mr-2">
                    {wine.finishLength}
                  </span>
                )}
                {wine.finish && <p className="text-sm text-white mt-1">{wine.finish}</p>}
              </div>
            )}
          </section>
        )}

        {/* 구조감 */}
        {hasStructure && (
          <section className="bg-[#140c0f] border border-[#2a1520] rounded-xl p-4">
            <SectionTitle>구조감 (Structure)</SectionTitle>
            <div className="space-y-3">
              <ScaleRow label="당도" value={wine.sweetness} options={SWEETNESS_OPTIONS} />
              <ScaleRow label="산도" value={wine.acidity} options={ACIDITY_OPTIONS} />
              <ScaleRow label="타닌" value={wine.tannin} options={TANNIN_OPTIONS} />
              <ScaleRow label="알코올" value={wine.alcoholLevel} options={ALCOHOL_OPTIONS} />
              <ScaleRow label="바디" value={wine.body} options={BODY_OPTIONS} />
              <ScaleRow label="풍미 강도" value={wine.flavourIntensity} options={FLAVOUR_INTENSITY_OPTIONS} />
            </div>
          </section>
        )}

        {/* 종합 평가 */}
        {hasQuality && (
          <section className="bg-[#140c0f] border border-[#2a1520] rounded-xl p-4">
            <SectionTitle>종합 평가</SectionTitle>
            <div className="space-y-3">
              {qualityLabel && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-28 shrink-0">품질</span>
                  <span className="text-sm font-semibold text-[#d4af6a]">{qualityLabel}</span>
                </div>
              )}
              {wine.ageing && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-28 shrink-0">숙성 가능성</span>
                  <span className="text-sm text-white">{wine.ageing}</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 평점 */}
        <section className="bg-[#140c0f] border border-[#2a1520] rounded-xl p-4">
          <SectionTitle>평점</SectionTitle>
          <div className="flex items-center gap-6 flex-wrap">
            <div>
              <p className="text-xs text-gray-500 mb-1.5">내 평점</p>
              {wine.myRating > 0 ? (
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-bold text-[#d4af6a]">{wine.myRating}</span>
                    <span className="text-gray-500 text-sm">/ 10점</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {'★'.repeat(Math.round(wine.myRating / 2))}{'☆'.repeat(5 - Math.round(wine.myRating / 2))}
                    {' '}{(wine.myRating / 2).toFixed(2).replace(/\.?0+$/, '')} / 5.0
                  </p>
                </div>
              ) : (
                <span className="text-gray-600 text-sm">미평가</span>
              )}
            </div>
            {wine.vivinoRating && (
              <div>
                <p className="text-xs text-gray-500 mb-1">비비노 평점</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-bold text-[#d4af6a]">{wine.vivinoRating}</span>
                  <span className="text-gray-500 text-sm">/ 5.0</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 가격 & 구매 */}
        {(wine.price || wine.purchaseLocation || wine.wineSearcherPrice) && (
          <section className="bg-[#140c0f] border border-[#2a1520] rounded-xl p-4">
            <SectionTitle>가격 & 구매</SectionTitle>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
              {wine.price && (
                <InfoItem label="구매 가격" value={formatPrice(wine.price, wine.currency)} />
              )}
              {wine.purchaseLocation && (
                <InfoItem label="구매처" value={wine.purchaseLocation} />
              )}
              {wine.wineSearcherPrice && (
                <InfoItem label="와인서쳐 평균" value={wine.wineSearcherPrice} />
              )}
            </dl>
          </section>
        )}

        {/* 음식 페어링 */}
        {wine.foodPairing.length > 0 && (
          <section className="bg-[#140c0f] border border-[#2a1520] rounded-xl p-4">
            <SectionTitle>음식 페어링</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {wine.foodPairing.map((f) => (
                <span key={f} className="bg-[#1a0f13] border border-[#3d1f2a] text-gray-300 text-xs rounded-md px-2.5 py-1">
                  🍽 {f}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* 메모 */}
        {wine.notes && (
          <section className="bg-[#140c0f] border border-[#2a1520] rounded-xl p-4">
            <SectionTitle>메모</SectionTitle>
            <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{wine.notes}</p>
          </section>
        )}

        {/* 기록 날짜 */}
        <p className="text-center text-xs text-gray-600">
          기록: {new Date(wine.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
          {wine.updatedAt !== wine.createdAt && ` · 수정: ${new Date(wine.updatedAt).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}`}
        </p>
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#1a0f13] border border-[#3d1f2a] rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-white font-semibold text-lg mb-2">와인 삭제</h3>
            <p className="text-gray-400 text-sm mb-6">
              <strong className="text-white">{wine.name}</strong> 기록을 삭제하시겠습니까?<br />
              이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#3d1f2a] text-gray-300 hover:bg-[#2a1520] transition-colors text-sm"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-800 hover:bg-red-700 text-white transition-colors text-sm font-medium"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
