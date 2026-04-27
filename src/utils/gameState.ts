import type { GameState, Idol } from '../types/game';
import { IDOL_NAMES, IDOL_STATS, RARITY_CONFIG, BASE_SALARY } from '../types/game';

export const GACHA_COST = 5000;
export const UPGRADE_COST = 500;

const STORAGE_KEY = 'idol-manager-game-v2';

export const createInitialState = (): GameState => ({
  money: 50000,
  gems: 100,
  fans: 0,
  level: 1,
  experience: 0,
  idols: [],
  teams: [],
  facilities: {
    trainingRoom: 0,
    vocalStudio: 0,
    danceStudio: 0,
    rapStudio: 0,
    visualStudio: 0,
    concertHall: 0,
    dormitory: 0,
    cafeteria: 0,
    hospital: 0,
    studio: 0,
  },
  concerts: [],
  achievements: [],
  lastOfflineTime: Date.now(),
  totalPlayTime: 0,
  dailyLoginStreak: 1,
  lastLoginDate: new Date().toISOString().split('T')[0],
});

export const saveGameState = (state: GameState): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const loadGameState = (): GameState => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return createInitialState();
    }
  }
  return createInitialState();
};

// 뽑기 시스템 (더 나은 확률)
export const performGacha = (): Idol => {
  const rand = Math.random();
  let rarity: keyof typeof RARITY_CONFIG;

  if (rand < RARITY_CONFIG.mythic.rate) {
    rarity = 'mythic';
  } else if (rand < RARITY_CONFIG.mythic.rate + RARITY_CONFIG.legendary.rate) {
    rarity = 'legendary';
  } else if (rand < RARITY_CONFIG.mythic.rate + RARITY_CONFIG.legendary.rate + RARITY_CONFIG.epic.rate) {
    rarity = 'epic';
  } else if (rand < RARITY_CONFIG.mythic.rate + RARITY_CONFIG.legendary.rate + RARITY_CONFIG.epic.rate + RARITY_CONFIG.rare.rate) {
    rarity = 'rare';
  } else {
    rarity = 'common';
  }

  const positions: Array<'vocal' | 'dance' | 'rap' | 'visual'> = ['vocal', 'dance', 'rap', 'visual'];
  const position = positions[Math.floor(Math.random() * positions.length)];
  
  const names = IDOL_NAMES[rarity];
  const name = names[Math.floor(Math.random() * names.length)];
  const stats = IDOL_STATS[rarity];

  const idol: Idol = {
    id: `idol-${Date.now()}-${Math.random()}`,
    name,
    rarity,
    position,
    level: 1,
    experience: 0,
    vocal: stats.vocal,
    dance: stats.dance,
    rap: stats.rap,
    visual: stats.visual,
    charm: stats.visual,
    fans: 0,
    popularity: 0,
    health: 100,
    maxHealth: 100,
    joinedAt: Date.now(),
  };

  return idol;
};

// 오프라인 수익 계산 (향상됨)
export const calculateOfflineEarnings = (state: GameState): { money: number; fans: number; experience: number } => {
  const now = Date.now();
  const offlineSeconds = Math.min((now - state.lastOfflineTime) / 1000, 8 * 60 * 60);

  let moneyPerSecond = BASE_SALARY;
  let fansPerSecond = 0.5;
  let expPerSecond = 0.1;

  // 시설 효과
  moneyPerSecond += state.facilities.trainingRoom * 2;
  moneyPerSecond += state.facilities.cafeteria * 1.5;
  fansPerSecond += state.facilities.concertHall * 0.5;

  // 아이돌 수에 따른 수익
  moneyPerSecond += state.idols.length * 5;
  fansPerSecond += state.idols.length * 2;

  // 팀 시너지 보너스
  state.teams.forEach((team) => {
    moneyPerSecond += team.synergy * 0.5;
    fansPerSecond += team.synergy * 0.2;
  });

  // 아이돌 능력치에 따른 수익
  state.idols.forEach((idol) => {
    const totalStats = idol.vocal + idol.dance + idol.rap + idol.visual;
    moneyPerSecond += totalStats * 0.2;
    fansPerSecond += totalStats * 0.1;
    expPerSecond += totalStats * 0.01;
  });

  return {
    money: Math.floor(offlineSeconds * moneyPerSecond),
    fans: Math.floor(offlineSeconds * fansPerSecond),
    experience: Math.floor(offlineSeconds * expPerSecond),
  };
};

// 아이돌 레벨업
export const levelUpIdol = (idol: Idol): Idol => {
  const nextLevelExp = idol.level * 100;
  if (idol.experience >= nextLevelExp) {
    return {
      ...idol,
      level: idol.level + 1,
      experience: idol.experience - nextLevelExp,
      vocal: idol.vocal + 2,
      dance: idol.dance + 2,
      rap: idol.rap + 2,
      visual: idol.visual + 2,
      maxHealth: idol.maxHealth + 10,
      health: idol.maxHealth + 10,
    };
  }
  return idol;
};

// 팀 시너지 계산
export const calculateTeamSynergy = (state: GameState, teamId: string): number => {
  const team = state.teams.find((t) => t.id === teamId);
  if (!team) return 0;

  const members = state.idols.filter((idol) => team.members.includes(idol.id));
  if (members.length === 0) return 0;

  // 포지션 다양성 보너스
  const positions = new Set(members.map((m) => m.position));
  const positionBonus = positions.size * 10;

  // 레벨 평균
  const avgLevel = members.reduce((sum, m) => sum + m.level, 0) / members.length;

  // 등급 보너스
  const rarityBonus = members.reduce((sum, m) => {
    const rarityValues = { common: 1, rare: 2, epic: 3, legendary: 4, mythic: 5 };
    return sum + rarityValues[m.rarity];
  }, 0);

  return Math.floor(positionBonus + avgLevel * 2 + rarityBonus);
};

// 시설 업그레이드 비용
export const upgradeFacilityCost = (currentLevel: number): number => {
  const baseCost = 1000;
  return Math.floor(baseCost * Math.pow(1.3, currentLevel));
};

// 경험치 레벨업
export const checkPlayerLevelUp = (state: GameState): GameState => {
  const nextLevelExp = state.level * 500;
  if (state.experience >= nextLevelExp) {
    return {
      ...state,
      level: state.level + 1,
      experience: state.experience - nextLevelExp,
    };
  }
  return state;
};

// 일일 로그인 보너스
export const checkDailyLogin = (state: GameState): GameState => {
  const today = new Date().toISOString().split('T')[0];
  if (state.lastLoginDate !== today) {
    const bonus = 1000 * state.dailyLoginStreak;
    return {
      ...state,
      money: state.money + bonus,
      dailyLoginStreak: state.dailyLoginStreak + 1,
      lastLoginDate: today,
    };
  }
  return state;
};
