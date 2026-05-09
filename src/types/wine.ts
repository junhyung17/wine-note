export type WineColor = 'red' | 'white' | 'rosé' | 'sparkling' | 'dessert' | 'fortified' | 'orange';

export interface WineNote {
  id: string;
  // 기본 정보
  producer: string;
  name: string;
  vintage: string;
  color: WineColor;
  region: string;
  country: string;
  grape: string;
  // 테이스팅 노트
  appearance: string;
  nose: string[];
  palate: string[];
  finish: string;
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
  '드라이', '스위트', '오프드라이',
  '라이트 바디', '미디엄 바디', '풀 바디',
  '낮은 산도', '중간 산도', '높은 산도', '생기있는',
  '부드러운 탄닌', '실키한 탄닌', '탄탄한 탄닌', '거친 탄닌',
  '짧은 피니시', '중간 피니시', '긴 피니시',
  '균형잡힌', '복합적인', '우아한', '강렬한',
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
