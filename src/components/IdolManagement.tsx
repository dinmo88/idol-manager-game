import type { GameState } from '../types/game';
import { RARITY_CONFIG, POSITION_CONFIG } from '../types/game';

interface IdolManagementProps {
  gameState: GameState;
  onUpgradeStat: (idolId: string, stat: 'vocal' | 'dance' | 'rap' | 'visual') => void;
  onBack: () => void;
}

export default function IdolManagement({
  gameState,
  onUpgradeStat,
  onBack,
}: IdolManagementProps) {
  const sortedIdols = [...gameState.idols].sort((a, b) => {
    const rarityOrder = { mythic: 5, legendary: 4, epic: 3, rare: 2, common: 1 };
    return rarityOrder[b.rarity as keyof typeof rarityOrder] - rarityOrder[a.rarity as keyof typeof rarityOrder];
  });

  return (
    <div className="idol-management">
      <div className="management-header">
        <h1>👨‍👩‍👧‍👦 아이돌 관리</h1>
        <div className="idol-count">총 {gameState.idols.length}명</div>
      </div>

      {gameState.idols.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎤</div>
          <p>아직 아이돌이 없습니다.</p>
          <p className="empty-hint">뽑기를 통해 아이돌을 영입해보세요!</p>
        </div>
      ) : (
        <div className="idols-grid">
          {sortedIdols.map((idol) => (
            <div
              key={idol.id}
              className="idol-card-full"
              style={{
                borderColor: RARITY_CONFIG[idol.rarity as keyof typeof RARITY_CONFIG].color,
              }}
            >
              <div className="idol-header">
                <div className="idol-name-section">
                  <h3>{idol.name}</h3>
                  <span className="idol-rarity">{idol.rarity.toUpperCase()}</span>
                </div>
                <div className="idol-level">Lv. {idol.level}</div>
              </div>

              <div className="idol-position-badge">
                {POSITION_CONFIG[idol.position as keyof typeof POSITION_CONFIG].icon}
                {POSITION_CONFIG[idol.position as keyof typeof POSITION_CONFIG].label}
              </div>

              {/* 능력치 */}
              <div className="stats-section">
                <div className="stat-row">
                  <div className="stat-box">
                    <span className="stat-icon">🎤</span>
                    <span className="stat-name">보컬</span>
                    <span className="stat-value">{idol.vocal}</span>
                    <button
                      onClick={() => onUpgradeStat(idol.id, 'vocal')}
                      className="upgrade-btn"
                      disabled={gameState.money < 500}
                    >
                      +5
                    </button>
                  </div>
                  <div className="stat-box">
                    <span className="stat-icon">💃</span>
                    <span className="stat-name">댄스</span>
                    <span className="stat-value">{idol.dance}</span>
                    <button
                      onClick={() => onUpgradeStat(idol.id, 'dance')}
                      className="upgrade-btn"
                      disabled={gameState.money < 500}
                    >
                      +5
                    </button>
                  </div>
                  <div className="stat-box">
                    <span className="stat-icon">🎙️</span>
                    <span className="stat-name">랩</span>
                    <span className="stat-value">{idol.rap}</span>
                    <button
                      onClick={() => onUpgradeStat(idol.id, 'rap')}
                      className="upgrade-btn"
                      disabled={gameState.money < 500}
                    >
                      +5
                    </button>
                  </div>
                  <div className="stat-box">
                    <span className="stat-icon">✨</span>
                    <span className="stat-name">비주얼</span>
                    <span className="stat-value">{idol.visual}</span>
                    <button
                      onClick={() => onUpgradeStat(idol.id, 'visual')}
                      className="upgrade-btn"
                      disabled={gameState.money < 500}
                    >
                      +5
                    </button>
                  </div>
                </div>
              </div>

              {/* 추가 정보 */}
              <div className="idol-info">
                <div className="info-item">
                  <span>👥 팬:</span>
                  <span>{Math.floor(idol.fans).toLocaleString()}</span>
                </div>
                <div className="info-item">
                  <span>⭐ 인기도:</span>
                  <span>{Math.floor(idol.popularity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button onClick={onBack} className="btn-back">
        ← 돌아가기
      </button>
    </div>
  );
}
