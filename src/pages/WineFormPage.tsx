import { useState, useEffect, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import {
  type WineColor, type WineFormData,
  COLOR_LABELS, NOSE_DESCRIPTORS, PALATE_DESCRIPTORS, FOOD_PAIRING_OPTIONS,
  APPEARANCE_INTENSITY_OPTIONS, NOSE_INTENSITY_OPTIONS, SWEETNESS_OPTIONS,
  ACIDITY_OPTIONS, TANNIN_OPTIONS, ALCOHOL_OPTIONS, BODY_OPTIONS,
  FLAVOUR_INTENSITY_OPTIONS, FINISH_LENGTH_OPTIONS, QUALITY_OPTIONS,
} from '../types/wine';
import { createWine, updateWine, fetchWine, type WineCatalogEntry } from '../api/wineApi';
import TagInput from '../components/TagInput';
import GrapeBlendInput from '../components/GrapeBlendInput';
import WineSearchAutocomplete from '../components/WineSearchAutocomplete';
import PhotoUpload from '../components/PhotoUpload';

const COLORS: WineColor[] = ['red', 'white', 'rosé', 'sparkling', 'orange', 'dessert', 'fortified'];
const COLOR_EMOJIS: Record<WineColor, string> = {
  red: '🍷', white: '🥂', rosé: '🌸', sparkling: '✨', orange: '🟠', dessert: '🍯', fortified: '🏰',
};

const defaultForm: WineFormData = {
  producer: '', name: '', vintage: '', color: 'red',
  region: '', country: '', grape: [],
  abv: null,
  appearance: '', appearanceIntensity: '', appearanceColor: '',
  noseIntensity: '', nose: [],
  sweetness: '', acidity: '', tannin: '', alcoholLevel: '', body: '', flavourIntensity: '',
  palate: [],
  finishLength: '', finish: '',
  quality: '', ageing: '',
  myRating: 0, vivinoRating: '',
  price: '', currency: 'KRW', purchaseLocation: '', wineSearcherPrice: '',
  foodPairing: [], photos: [], notes: '',
  dateTasted: new Date().toISOString().split('T')[0],
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      {children}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full bg-[#1a0f13] border border-[#3d1f2a] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#8f1c39] transition-colors text-sm ${props.className ?? ''}`}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full bg-[#1a0f13] border border-[#3d1f2a] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#8f1c39] transition-colors text-sm resize-none ${props.className ?? ''}`}
    />
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-semibold text-[#d4af6a] border-b border-[#2a1520] pb-2 mb-4">
      {children}
    </h2>
  );
}

function ScoreInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const adj = (delta: number) => {
    const next = Math.round((value + delta) * 10) / 10;
    onChange(Math.min(10, Math.max(0, next)));
  };
  const stars = value > 0 ? (value / 2).toFixed(2).replace(/\.?0+$/, '') : null;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center bg-[#1a0f13] border border-[#3d1f2a] rounded-lg overflow-hidden">
        <button type="button" onClick={() => adj(-0.1)}
          className="px-3 py-2.5 text-gray-400 hover:text-white hover:bg-[#2a1520] transition-colors select-none">
          −
        </button>
        <input
          type="number"
          value={value || ''}
          onChange={(e) => {
            const v = Math.round(Number(e.target.value) * 10) / 10;
            onChange(isNaN(v) ? 0 : Math.min(10, Math.max(0, v)));
          }}
          min="0" max="10" step="0.1"
          placeholder="0"
          className="w-14 bg-transparent text-white text-center text-sm focus:outline-none py-2.5"
        />
        <button type="button" onClick={() => adj(0.1)}
          className="px-3 py-2.5 text-gray-400 hover:text-white hover:bg-[#2a1520] transition-colors select-none">
          +
        </button>
      </div>
      <span className="text-gray-500 text-sm">/ 10점</span>
      {stars && (
        <span className="text-[#d4af6a] text-sm">★ {stars} / 5.0</span>
      )}
    </div>
  );
}

function ScaleSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T | '';
  options: { value: T; label: string }[];
  onChange: (v: T | '') => void;
}) {
  return (
    <Field label={label}>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(value === opt.value ? '' : opt.value)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all border ${
              value === opt.value
                ? 'bg-[#8f1c39] text-white border-[#cc2a4e]'
                : 'bg-[#1a0f13] text-gray-400 border-[#3d1f2a] hover:border-[#8f1c39] hover:text-gray-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </Field>
  );
}

export default function WineFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<WineFormData>(defaultForm);
  const [saving, setSaving] = useState(false);

  function handleCatalogSelect(entry: WineCatalogEntry) {
    setForm((prev) => ({
      ...prev,
      producer: entry.producer,
      name: entry.name,
      country: entry.country,
      region: entry.region,
      grape: entry.grapes.map((name) => ({ name, percentage: null })),
    }));
  }

  useEffect(() => {
    if (id) {
      fetchWine(Number(id))
        .then((wine) => {
          const { id: _id, createdAt: _c, updatedAt: _u, ...formData } = wine;
          setForm(formData);
        })
        .catch(console.error);
    }
  }, [id]);

  function set<K extends keyof WineFormData>(key: K, value: WineFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleText(key: keyof WineFormData) {
    return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(key, e.target.value as never);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (isEdit && id) {
        await updateWine(Number(id), form);
      } else {
        await createWine(form);
      }
      navigate('/');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0a0c]">
      {/* 헤더 */}
      <header className="sticky top-0 z-20 bg-[#0f0a0c]/95 backdrop-blur border-b border-[#2a1520] px-4 py-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-[#1a0f13] text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-white flex-1">
          {isEdit ? '와인 수정' : '새 와인 기록'}
        </h1>
        <button
          type="submit"
          form="wine-form"
          disabled={saving || !form.name.trim()}
          className="bg-[#8f1c39] hover:bg-[#ab1e3f] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          {saving ? '저장 중...' : '저장'}
        </button>
      </header>

      <form id="wine-form" onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        {/* 기본 정보 */}
        <section>
          <SectionTitle>기본 정보</SectionTitle>
          <div className="space-y-4">
            <Field label="와인 검색">
              <WineSearchAutocomplete onSelect={handleCatalogSelect} />
            </Field>

            <Field label="와인 색상">
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => set('color', c)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      form.color === c
                        ? 'bg-[#8f1c39] text-white border border-[#cc2a4e]'
                        : 'bg-[#1a0f13] text-gray-400 border border-[#3d1f2a] hover:border-[#8f1c39]'
                    }`}
                  >
                    {COLOR_EMOJIS[c]} {COLOR_LABELS[c]}
                  </button>
                ))}
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="생산자 *">
                <Input
                  value={form.producer}
                  onChange={handleText('producer')}
                  placeholder="Château Margaux"
                />
              </Field>
              <Field label="와인 이름 *">
                <Input
                  value={form.name}
                  onChange={handleText('name')}
                  placeholder="Margaux"
                  required
                />
              </Field>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Field label="빈티지">
                <Input
                  value={form.vintage}
                  onChange={handleText('vintage')}
                  placeholder="2019"
                  maxLength={4}
                />
              </Field>
              <Field label="생산 국가">
                <Input
                  value={form.country}
                  onChange={handleText('country')}
                  placeholder="프랑스"
                />
              </Field>
              <Field label="생산 지역">
                <Input
                  value={form.region}
                  onChange={handleText('region')}
                  placeholder="Bordeaux"
                />
              </Field>
            </div>

            <Field label="포도 품종 & 블렌딩 비율">
              <GrapeBlendInput
                grapes={form.grape}
                onChange={(grapes) => set('grape', grapes)}
                wineColor={form.color}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="알코올 도수 (%)">
                <Input
                  type="number"
                  value={form.abv ?? ''}
                  onChange={(e) => set('abv', e.target.value === '' ? null : Number(e.target.value))}
                  placeholder="13.5"
                  step="0.1"
                  min="0"
                  max="25"
                />
              </Field>
              <Field label="시음일">
                <Input
                  type="date"
                  value={form.dateTasted}
                  onChange={handleText('dateTasted')}
                />
              </Field>
            </div>
          </div>
        </section>

        {/* 테이스팅 노트 */}
        <section>
          <SectionTitle>테이스팅 노트</SectionTitle>
          <div className="space-y-4">
            <ScaleSelect
              label="외관 강도"
              value={form.appearanceIntensity}
              options={APPEARANCE_INTENSITY_OPTIONS}
              onChange={(v) => set('appearanceIntensity', v)}
            />
            <div className="grid grid-cols-2 gap-4">
              <Field label="외관 색상 표현">
                <Input
                  value={form.appearanceColor}
                  onChange={handleText('appearanceColor')}
                  placeholder="딥 루비, 밝은 레몬 옐로"
                />
              </Field>
              <Field label="외관 (투명도 등)">
                <Input
                  value={form.appearance}
                  onChange={handleText('appearance')}
                  placeholder="맑고 투명한, 약간의 침전"
                />
              </Field>
            </div>

            <ScaleSelect
              label="향 강도 (Nose Intensity)"
              value={form.noseIntensity}
              options={NOSE_INTENSITY_OPTIONS}
              onChange={(v) => set('noseIntensity', v)}
            />
            <TagInput
              label="향 (아로마/부케)"
              tags={form.nose}
              onChange={(tags) => set('nose', tags)}
              suggestions={NOSE_DESCRIPTORS}
              placeholder="향을 입력하거나 선택하세요"
            />

            <TagInput
              label="맛 (팔레트)"
              tags={form.palate}
              onChange={(tags) => set('palate', tags)}
              suggestions={PALATE_DESCRIPTORS}
              placeholder="맛을 입력하거나 선택하세요"
            />

            <ScaleSelect
              label="여운 길이 (Finish Length)"
              value={form.finishLength}
              options={FINISH_LENGTH_OPTIONS}
              onChange={(v) => set('finishLength', v)}
            />
            <Field label="여운 설명">
              <Input
                value={form.finish}
                onChange={handleText('finish')}
                placeholder="긴 여운, 탄닌의 부드러운 마무리"
              />
            </Field>
          </div>
        </section>

        {/* 구조감 */}
        <section>
          <SectionTitle>구조감 (Structure)</SectionTitle>
          <div className="space-y-4">
            <ScaleSelect
              label="당도 (Sweetness)"
              value={form.sweetness}
              options={SWEETNESS_OPTIONS}
              onChange={(v) => set('sweetness', v)}
            />
            <ScaleSelect
              label="산도 (Acidity)"
              value={form.acidity}
              options={ACIDITY_OPTIONS}
              onChange={(v) => set('acidity', v)}
            />
            <ScaleSelect
              label="타닌 (Tannin)"
              value={form.tannin}
              options={TANNIN_OPTIONS}
              onChange={(v) => set('tannin', v)}
            />
            <ScaleSelect
              label="알코올 레벨 (Alcohol)"
              value={form.alcoholLevel}
              options={ALCOHOL_OPTIONS}
              onChange={(v) => set('alcoholLevel', v)}
            />
            <ScaleSelect
              label="바디 (Body)"
              value={form.body}
              options={BODY_OPTIONS}
              onChange={(v) => set('body', v)}
            />
            <ScaleSelect
              label="풍미 강도 (Flavour Intensity)"
              value={form.flavourIntensity}
              options={FLAVOUR_INTENSITY_OPTIONS}
              onChange={(v) => set('flavourIntensity', v)}
            />
          </div>
        </section>

        {/* 종합 평가 */}
        <section>
          <SectionTitle>종합 평가</SectionTitle>
          <div className="space-y-4">
            <ScaleSelect
              label="품질 (Quality)"
              value={form.quality}
              options={QUALITY_OPTIONS}
              onChange={(v) => set('quality', v)}
            />
            <Field label="숙성 가능성">
              <Input
                value={form.ageing}
                onChange={handleText('ageing')}
                placeholder="5-10년, 지금 마셔도 좋음"
              />
            </Field>
          </div>
        </section>

        {/* 평점 */}
        <section>
          <SectionTitle>평점 & 가격</SectionTitle>
          <div className="space-y-4">
            <Field label="내 평점">
              <ScoreInput value={form.myRating} onChange={(v) => set('myRating', v)} />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="비비노 평점">
                <Input
                  value={form.vivinoRating}
                  onChange={handleText('vivinoRating')}
                  placeholder="4.2"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                />
              </Field>
              <Field label="와인서쳐 평균 가격">
                <Input
                  value={form.wineSearcherPrice}
                  onChange={handleText('wineSearcherPrice')}
                  placeholder="120,000"
                />
              </Field>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Field label="통화">
                <select
                  value={form.currency}
                  onChange={(e) => set('currency', e.target.value)}
                  className="w-full bg-[#1a0f13] border border-[#3d1f2a] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#8f1c39] transition-colors text-sm"
                >
                  <option value="KRW">KRW ₩</option>
                  <option value="USD">USD $</option>
                  <option value="EUR">EUR €</option>
                  <option value="JPY">JPY ¥</option>
                </select>
              </Field>
              <Field label="구매 가격">
                <Input
                  value={form.price}
                  onChange={handleText('price')}
                  placeholder="89,000"
                />
              </Field>
              <Field label="구매처">
                <Input
                  value={form.purchaseLocation}
                  onChange={handleText('purchaseLocation')}
                  placeholder="와인 갤러리, 이마트"
                />
              </Field>
            </div>
          </div>
        </section>

        {/* 음식 페어링 */}
        <section>
          <SectionTitle>음식 페어링</SectionTitle>
          <TagInput
            label=""
            tags={form.foodPairing}
            onChange={(tags) => set('foodPairing', tags)}
            suggestions={FOOD_PAIRING_OPTIONS}
            placeholder="잘 어울리는 음식을 선택하세요"
          />
        </section>

        {/* 사진 */}
        <section>
          <SectionTitle>사진</SectionTitle>
          <PhotoUpload photos={form.photos} onChange={(photos) => set('photos', photos)} />
        </section>

        {/* 메모 */}
        <section>
          <SectionTitle>메모</SectionTitle>
          <Textarea
            value={form.notes}
            onChange={handleText('notes')}
            rows={4}
            placeholder="추가 메모, 마신 장소, 함께한 사람, 특별한 기억..."
          />
        </section>

        <div className="pb-8">
          <button
            type="submit"
            disabled={saving || !form.name.trim()}
            className="w-full bg-[#8f1c39] hover:bg-[#ab1e3f] disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium py-3.5 rounded-xl transition-colors text-base"
          >
            {saving ? '저장 중...' : isEdit ? '수정 저장' : '와인 기록 저장'}
          </button>
        </div>
      </form>
    </div>
  );
}
