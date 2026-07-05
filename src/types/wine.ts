export type WineColor = 'red' | 'white' | 'rosé' | 'sparkling' | 'dessert' | 'fortified' | 'orange';

export type AppearanceIntensity = 'pale' | 'medium' | 'deep';
export type NoseIntensity = 'light' | 'medium' | 'pronounced';
export type Sweetness = 'dry' | 'off-dry' | 'medium-dry' | 'medium-sweet' | 'sweet' | 'luscious';
export type Acidity = 'low' | 'medium' | 'high';
export type Tannin = 'low' | 'medium' | 'high';
export type AlcoholLevel = 'low' | 'medium' | 'high';
export type Body = 'light' | 'medium' | 'full';
export type FlavourIntensity = 'light' | 'medium' | 'pronounced';
export type FinishLength = 'short' | 'medium' | 'long';
export type Quality = 'acceptable' | 'good' | 'very-good' | 'outstanding';

export interface WineNote {
  id: number;
  // 기본 정보
  producer: string;
  name: string;
  vintage: string;
  color: WineColor;
  region: string;
  country: string;
  grape: string[];
  abv: number | null;
  // 외관
  appearance: string;
  appearanceIntensity: AppearanceIntensity | '';
  appearanceColor: string;
  // 향
  noseIntensity: NoseIntensity | '';
  nose: string[];
  // 구조감
  sweetness: Sweetness | '';
  acidity: Acidity | '';
  tannin: Tannin | '';
  alcoholLevel: AlcoholLevel | '';
  body: Body | '';
  flavourIntensity: FlavourIntensity | '';
  palate: string[];
  // 여운
  finishLength: FinishLength | '';
  finish: string;
  // 종합
  quality: Quality | '';
  ageing: string;
  // 평점
  myRating: number;
  vivinoRating: string;
  // 가격 & 구매
  price: string;
  currency: string;
  purchaseLocation: string;
  wineSearcherPrice: string;
  // 기타
  foodPairing: string[];
  photos: string[];
  notes: string;
  dateTasted: string;
  createdAt: string;
  updatedAt: string;
}

export type WineFormData = Omit<WineNote, 'id' | 'createdAt' | 'updatedAt'>;

export const COLOR_LABELS: Record<WineColor, string> = {
  red: '레드',
  white: '화이트',
  rosé: '로제',
  sparkling: '스파클링',
  dessert: '디저트',
  fortified: '주정강화',
  orange: '오렌지',
};

export const COLOR_HEX: Record<WineColor, string> = {
  red: '#8B1A2F',
  white: '#F5E6A3',
  rosé: '#F4A8B8',
  sparkling: '#D4EAF7',
  dessert: '#D4AF6A',
  fortified: '#8B4513',
  orange: '#E8853D',
};

export const NOSE_DESCRIPTORS = [
  '블랙베리', '체리', '자두', '라즈베리', '딸기', '블루베리',
  '레몬', '라임', '자몽', '오렌지', '사과', '배',
  '복숭아', '살구', '무화과', '건포도',
  '바닐라', '초콜릿', '커피', '카라멜', '토스트', '오크',
  '가죽', '담배', '흙', '미네랄', '연기', '트러플',
  '장미', '제비꽃', '라벤더', '유칼립투스', '허브',
  '후추', '계피', '정향', '감초',
  '버터', '크림', '꿀', '아카시아',
];

export const PALATE_DESCRIPTORS = [
  '균형잡힌', '복합적인', '우아한', '강렬한', '미네랄', '과실향',
  '스파이시', '흙냄새', '오크', '크리미', '신선한', '농밀한',
];

export const FOOD_PAIRING_OPTIONS = [
  '스테이크', '립아이', '안심', '양고기', '돼지고기',
  '닭고기', '오리', '연어', '참치', '해산물',
  '파스타', '피자', '리조또', '버거',
  '치즈', '하드치즈', '소프트치즈', '블루치즈',
  '초콜릿', '디저트', '과일',
  '샐러드', '채소', '버섯', '트러플',
  '스시', '회', '한식',
];

// 구조감 선택지 정의
export const APPEARANCE_INTENSITY_OPTIONS: { value: AppearanceIntensity; label: string }[] = [
  { value: 'pale', label: 'Pale' },
  { value: 'medium', label: 'Medium' },
  { value: 'deep', label: 'Deep' },
];

export const NOSE_INTENSITY_OPTIONS: { value: NoseIntensity; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'medium', label: 'Medium' },
  { value: 'pronounced', label: 'Pronounced' },
];

export const SWEETNESS_OPTIONS: { value: Sweetness; label: string }[] = [
  { value: 'dry', label: 'Dry' },
  { value: 'off-dry', label: 'Off-dry' },
  { value: 'medium-dry', label: 'Med. Dry' },
  { value: 'medium-sweet', label: 'Med. Sweet' },
  { value: 'sweet', label: 'Sweet' },
  { value: 'luscious', label: 'Luscious' },
];

export const ACIDITY_OPTIONS: { value: Acidity; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export const TANNIN_OPTIONS: { value: Tannin; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export const ALCOHOL_OPTIONS: { value: AlcoholLevel; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export const BODY_OPTIONS: { value: Body; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'medium', label: 'Medium' },
  { value: 'full', label: 'Full' },
];

export const FLAVOUR_INTENSITY_OPTIONS: { value: FlavourIntensity; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'medium', label: 'Medium' },
  { value: 'pronounced', label: 'Pronounced' },
];

export const FINISH_LENGTH_OPTIONS: { value: FinishLength; label: string }[] = [
  { value: 'short', label: 'Short' },
  { value: 'medium', label: 'Medium' },
  { value: 'long', label: 'Long' },
];

export const QUALITY_OPTIONS: { value: Quality; label: string }[] = [
  { value: 'acceptable', label: 'Acceptable' },
  { value: 'good', label: 'Good' },
  { value: 'very-good', label: 'Very Good' },
  { value: 'outstanding', label: 'Outstanding' },
];

export const QUALITY_LABELS: Record<Quality, string> = {
  acceptable: 'Acceptable',
  good: 'Good',
  'very-good': 'Very Good',
  outstanding: 'Outstanding',
};
