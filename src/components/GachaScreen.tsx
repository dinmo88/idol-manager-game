import type { GameState, Idol } from '../types/game';
import { RARITY_CONFIG, POSITION_CONFIG } from '../types/game';

interface GachaScreenProps {
  gameState: GameState;
  gachaResult: Idol | null;
  onGacha: () => void;
  onBack: () => void;
}

export default function GachaScreen({
  gameState,
  gachaResult,
  onGacha,
  onBack,
}: GachaScreenProps) {
  const getRarityLabel = (rarity: string) => {
    const labels: Record<string, string> = {
      common: '⭐⭐ 커먼',
      rare: '⭐⭐⭐ 레어',
      epic: '⭐⭐⭐⭐ 에픽',
      legendary: '⭐⭐⭐⭐⭐ 레전더리',
      mythic: '✨ 신화급',
    };
    return labels[rarity] || rarity;
  };

  return (
    <div className="gacha-screen">
      <div className="gacha-container">
        <h1>🎰 뽑기</h1>

        {/* 자금 표시 */}
        <div className="gacha-money">
          <span>보유 자금: {Math.floor(gameState.money).toLocaleString()}</span>
        </div>

        {/* 뽑기 결과 */}
        {gachaResult ? (
          <div className="gacha-result">
            <div
              className={`idol-card ${gachaResult.rarity}`}
              style={{
                borderColor: RARITY_CONFIG[gachaResult.rarity as keyof typeof RARITY_CONFIG].color,
              }}
            >
              <div className="idol-image">🌟</div>
              <div className="idol-name">{gachaResult.name}</div>
              <div className="idol-rarity">{getRarityLabel(gachaResult.rarity)}</div>
              <div className="idol-position">
                {POSITION_CONFIG[gachaResult.position as keyof typeof POSITION_CONFIG].icon}
                {POSITION_CONFIG[gachaResult.position as keyof typeof POSITION_CONFIG].label}
              </div>

              <div className="idol-stats">
                <div className="stat">
                  <span>🎤</span>
                  <span>{gachaResult.vocal}</span>
                </div>
                <div className="stat">
                  <span>💃</span>
                  <span>{gachaResult.dance}</span>
                </div>
                <div className="stat">
                  <span>🎙️</span>
                  <span>{gachaResult.rap}</span>
                </div>
                <div className="stat">
                  <span>✨</span>
                  <span>{gachaResult.visual}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="gacha-placeholder">
            <div className="placeholder-icon">❓</div>
            <p>뽑기를 진행하면 새로운 아이돌을 영입할 수 있습니다!</p>
          </div>
        )}

        {/* 뽑기 확률 */}
        <div className="gacha-rates">
          <h3>📊 뽑기 확률</h3>
          <div className="rates-list">
            <div className="rate-item">
              <span>✨ 신화급</span>
              <span>2%</span>
            </div>
            <div className="rate-item">
              <span>⭐⭐⭐⭐⭐ 레전더리</span>
              <span>8%</span>
            </div>
            <div className="rate-item">
              <span>⭐⭐⭐⭐ 에픽</span>
              <span>15%</span>
            </div>
            <div className="rate-item">
              <span>⭐⭐⭐ 레어</span>
              <span>30%</span>
            </div>
            <div className="rate-item">
              <span>⭐⭐ 커먼</span>
              <span>45%</span>
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="gacha-buttons">
          <button
            onClick={onGacha}
            disabled={gameState.money < 5000}
            className="btn-primary"
          >
            🎰 뽑기 (5,000 💰)
          </button>
          <button onClick={onBack} className="btn-secondary">
            ← 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
