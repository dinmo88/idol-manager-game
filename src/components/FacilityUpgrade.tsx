import type { GameState } from '../types/game';

interface FacilityUpgradeProps {
  gameState: GameState;
  onUpgradeFacility: (facility: keyof GameState['facilities']) => void;
  onBack: () => void;
}

export default function FacilityUpgrade({
  gameState,
  onUpgradeFacility,
  onBack,
}: FacilityUpgradeProps) {
  const facilities = [
    {
      key: 'trainingRoom' as const,
      name: '훈련실',
      icon: '🎤',
      description: '아이돌의 기본 능력을 향상시킵니다',
      effect: '자금 +2/초',
    },
    {
      key: 'vocalStudio' as const,
      name: '보컬 스튜디오',
      icon: '🎙️',
      description: '보컬 능력을 집중적으로 훈련합니다',
      effect: '보컬 +10%',
    },
    {
      key: 'danceStudio' as const,
      name: '댄스 스튜디오',
      icon: '💃',
      description: '댄스 능력을 집중적으로 훈련합니다',
      effect: '댄스 +10%',
    },
    {
      key: 'rapStudio' as const,
      name: '랩 스튜디오',
      icon: '🎙️',
      description: '랩 능력을 집중적으로 훈련합니다',
      effect: '랩 +10%',
    },
    {
      key: 'visualStudio' as const,
      name: '비주얼 학원',
      icon: '✨',
      description: '비주얼 능력을 향상시킵니다',
      effect: '비주얼 +10%',
    },
    {
      key: 'concertHall' as const,
      name: '콘서트홀',
      icon: '🎪',
      description: '콘서트 수익을 증가시킵니다',
      effect: '팬 +0.5/초',
    },
    {
      key: 'dormitory' as const,
      name: '기숙사',
      icon: '🏠',
      description: '아이돌의 피로도 회복 속도를 높입니다',
      effect: '회복 +20%',
    },
    {
      key: 'cafeteria' as const,
      name: '카페테리아',
      icon: '🍽️',
      description: '아이돌의 만족도를 높입니다',
      effect: '자금 +1.5/초',
    },
    {
      key: 'hospital' as const,
      name: '병원',
      icon: '⚕️',
      description: '아이돌의 건강을 관리합니다',
      effect: '건강 +15%',
    },
    {
      key: 'studio' as const,
      name: '녹음실',
      icon: '🎵',
      description: '음반 제작으로 추가 수익을 얻습니다',
      effect: '수익 +25%',
    },
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return Math.floor(num).toString();
  };

  const calculateCost = (currentLevel: number): number => {
    const baseCost = 1000;
    return Math.floor(baseCost * Math.pow(1.3, currentLevel));
  };

  return (
    <div className="facility-upgrade">
      <div className="management-header">
        <h1>🏢 시설 업그레이드</h1>
        <div className="money-display">보유 자금: {formatNumber(gameState.money)}</div>
      </div>

      <div className="facilities-grid">
        {facilities.map((facility) => {
          const level = gameState.facilities[facility.key];
          const cost = calculateCost(level);
          const canUpgrade = gameState.money >= cost;

          return (
            <div key={facility.key} className="facility-card">
              <div className="facility-header">
                <div className="facility-icon">{facility.icon}</div>
                <div className="facility-info">
                  <h3>{facility.name}</h3>
                  <p className="facility-description">{facility.description}</p>
                </div>
                <div className="facility-level">Lv. {level}</div>
              </div>

              <div className="facility-effect">
                <span className="effect-icon">✨</span>
                <span>{facility.effect}</span>
              </div>

              <button
                onClick={() => onUpgradeFacility(facility.key)}
                disabled={!canUpgrade}
                className={`upgrade-button ${canUpgrade ? '' : 'disabled'}`}
              >
                업그레이드 ({formatNumber(cost)} 💰)
              </button>
            </div>
          );
        })}
      </div>

      <button onClick={onBack} className="btn-back">
        ← 돌아가기
      </button>
    </div>
  );
}
