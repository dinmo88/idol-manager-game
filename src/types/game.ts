// 아이돌 등급
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

// 아이돌 포지션
export type Position = 'vocal' | 'dance' | 'rap' | 'visual';

// 아이돌 인터페이스
export interface Idol {
  id: string;
  name: string;
  rarity: Rarity;
  position: Position;
  level: number;
  experience: number;
  vocal: number;
  dance: number;
  rap: number;
  visual: number;
  charm: number;
  fans: number;
  popularity: number;
  health: number;
  maxHealth: number;
  imageUrl?: string;
  joinedAt: number;
}

// 팀 인터페이스
export interface Team {
  id: string;
  name: string;
  members: string[]; // 아이돌 ID 배열
  level: number;
  fans: number;
  synergy: number; // 팀 시너지 점수
  createdAt: number;
}

// 콘서트 인터페이스
export interface Concert {
  id: string;
  name: string;
  difficulty: 'easy' | 'normal' | 'hard' | 'extreme';
  reward: number;
  fanReward: number;
  requiredLevel: number;
  duration: number; // 초 단위
  isActive: boolean;
  completedAt?: number;
}

// 업적 인터페이스
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  reward: number;
  condition: string;
  completed: boolean;
  completedAt?: number;
}

// 게임 상태
export interface GameState {
  money: number;
  gems: number; // 프리미엄 화폐
  fans: number;
  level: number;
  experience: number;
  idols: Idol[];
  teams: Team[];
  facilities: FacilityUpgrades;
  concerts: Concert[];
  achievements: Achievement[];
  lastOfflineTime: number;
  totalPlayTime: number;
  dailyLoginStreak: number;
  lastLoginDate: string;
}

// 시설 업그레이드
export interface FacilityUpgrades {
  trainingRoom: number;
  vocalStudio: number;
  danceStudio: number;
  rapStudio: number;
  visualStudio: number;
  concertHall: number;
  dormitory: number;
  cafeteria: number;
  hospital: number;
  studio: number;
}

// 게임 설정
export const RARITY_CONFIG = {
  common: { color: '#808080', rate: 0.45, baseSalary: 100 },
  rare: { color: '#4169E1', rate: 0.30, baseSalary: 300 },
  epic: { color: '#9932CC', rate: 0.15, baseSalary: 800 },
  legendary: { color: '#FFD700', rate: 0.08, baseSalary: 2000 },
  mythic: { color: '#FF1493', rate: 0.02, baseSalary: 5000 },
};

export const POSITION_CONFIG = {
  vocal: { icon: '🎤', label: '보컬' },
  dance: { icon: '💃', label: '댄스' },
  rap: { icon: '🎙️', label: '랩' },
  visual: { icon: '✨', label: '비주얼' },
};

export const IDOL_NAMES = {
  common: ['민지', '해나', '지은', '수진', '예은', '소연', '유나', '지현', '나영', '지원'],
  rare: ['아이린', '슬기', '웬디', '조이', '루나', '써니', '티파니', '유리', '수영', '효연'],
  epic: ['나연', '정연', '모모', '사나', '지효', '다현', '채영', '쯔위', '미나', '다이'],
  legendary: ['아이유', '태연', '제니', '지수', '로제', '리사', '보라', '현아', '수지', '혜리'],
  mythic: ['아리아', '루미', '세라', '비비', '에스더', '아나', '노바', '제시카', '크리스탈', '앰버'],
};

export const IDOL_STATS = {
  common: { vocal: 10, dance: 10, rap: 8, visual: 10 },
  rare: { vocal: 20, dance: 20, rap: 18, visual: 20 },
  epic: { vocal: 35, dance: 35, rap: 33, visual: 35 },
  legendary: { vocal: 50, dance: 50, rap: 48, visual: 50 },
  mythic: { vocal: 70, dance: 70, rap: 68, visual: 70 },
};

export const GACHA_COST = 5000;
export const UPGRADE_COST = 500;
export const BASE_SALARY = 100;
