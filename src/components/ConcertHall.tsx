import type { GameState } from '../types/game';

interface ConcertHallProps {
  gameState: GameState;
  onBack: () => void;
  setGameState: (state: GameState) => void;
}

export default function ConcertHall({
  gameState,
  onBack,
  setGameState,
}: ConcertHallProps) {
  const concerts = [
    {
      id: 'easy',
      name: '소규모 공연',
      difficulty: 'easy' as const,
      reward: 5000,
      fanReward: 1000,
      requiredLevel: 1,
      duration: 10,
    },
    {
      id: 'normal',
      name: '정규 콘서트',
      difficulty: 'normal' as const,
      reward: 15000,
      fanReward: 5000,
      requiredLevel: 5,
      duration: 20,
    },
    {
      id: 'hard',
      name: '대규모 투어',
      difficulty: 'hard' as const,
      reward: 50000,
      fanReward: 20000,
      requiredLevel: 15,
      duration: 30,
    },
    {
      id: 'extreme',
      name: '월드 투어',
      difficulty: 'extreme' as const,
      reward: 150000,
      fanReward: 100000,
      requiredLevel: 30,
      duration: 60,
    },
  ];

  const handlePerformConcert = (concertId: string) => {
    const concert = concerts.find((c) => c.id === concertId);
    if (concert && gameState.level >= concert.requiredLevel) {
      setGameState({
        ...gameState,
        money: gameState.money + concert.reward,
        fans: gameState.fans + concert.fanReward,
      });
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return Math.floor(num).toString();
  };

  return (
    <div className="concert-hall">
      <div className="management-header">
        <h1>🎪 콘서트홀</h1>
        <p className="subtitle">공연을 통해 추가 수익을 얻으세요!</p>
      </div>

      <div className="concerts-grid">
        {concerts.map((concert) => {
          const canPerform = gameState.level >= concert.requiredLevel;

          return (
            <div
              key={concert.id}
              className={`concert-card ${concert.difficulty}`}
            >
              <div className="concert-header">
                <h3>{concert.name}</h3>
                <span className="difficulty-badge">{concert.difficulty.toUpperCase()}</span>
              </div>

              <div className="concert-requirements">
                <span>필요 레벨: {concert.requiredLevel}</span>
              </div>

              <div className="concert-rewards">
                <div className="reward-item">
                  <span className="reward-icon">💰</span>
                  <span>{formatNumber(concert.reward)}</span>
                </div>
                <div className="reward-item">
                  <span className="reward-icon">👥</span>
                  <span>{formatNumber(concert.fanReward)}</span>
                </div>
              </div>

              <div className="concert-duration">
                <span>⏱️ {concert.duration}초 소요</span>
              </div>

              <button
                onClick={() => handlePerformConcert(concert.id)}
                disabled={!canPerform}
                className={`perform-button ${canPerform ? '' : 'disabled'}`}
              >
                {canPerform ? '공연 시작' : '레벨 부족'}
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
