import { useState, useEffect, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { type WineColor, type WineFormData, COLOR_LABELS, NOSE_DESCRIPTORS, PALATE_DESCRIPTORS, FOOD_PAIRING_OPTIONS } from '../types/wine';
import { addWine, updateWine, getWineById } from '../store/wineStore';
import StarRating from '../components/StarRating';
import TagInput from '../components/TagInput';
import PhotoUpload from '../components/PhotoUpload';

const COLORS: WineColor[] = ['red', 'white', 'rosé', 'sparkling', 'orange', 'dessert', 'fortified'];
const COLOR_EMOJIS: Record<WineColor, string> = {
  red: '🍷', white: '🥂', rosé: '🌸', sparkling: '✨', orange: '🟠', dessert: '🍯', fortified: '🏰',
};

const defaultForm: WineFormData = {
  producer: '', name: '', vintage: '', color: 'red',
  region: '', country: '', grape: '',
  appearance: '', nose: [], palate: [], finish: '',
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

export default function WineFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<WineFormData>(defaultForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      const wine = getWineById(id);
      if (wine) {
        const { id: _id, createdAt: _c, updatedAt: _u, ...formData } = wine;
        setForm(formData);
      }
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
        updateWine(id, form);
      } else {
        addWine(form);
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

            <Field label="포도 품종">
              <Input
                value={form.grape}
                onChange={handleText('grape')}
                placeholder="Cabernet Sauvignon, Merlot"
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
        </section>

        {/* 테이스팅 노트 */}
        <section>
          <SectionTitle>테이스팅 노트</SectionTitle>
          <div className="space-y-4">
            <Field label="외관 (색상, 투명도)">
              <Input
                value={form.appearance}
                onChange={handleText('appearance')}
                placeholder="딥 루비, 맑고 투명한"
              />
            </Field>

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

            <Field label="피니시">
              <Input
                value={form.finish}
                onChange={handleText('finish')}
                placeholder="긴 여운, 탄닌의 부드러운 마무리"
              />
            </Field>
          </div>
        </section>

        {/* 평점 */}
        <section>
          <SectionTitle>평점 & 가격</SectionTitle>
          <div className="space-y-4">
            <Field label="내 평점">
              <StarRating value={form.myRating} onChange={(v) => set('myRating', v)} size="lg" />
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
