import type { GameState } from '../types/game';

interface MainDashboardProps {
  gameState: GameState;
  onNavigate: (screen: string) => void;
}

export default function MainDashboard({ gameState, onNavigate }: MainDashboardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return Math.floor(num).toString();
  };

  const nextLevelExp = gameState.level * 500;
  const expProgress = (gameState.experience / nextLevelExp) * 100;

  return (
    <div className="dashboard">
      {/* 헤더 */}
      <div className="header">
        <h1>🎤 아이돌 매니저</h1>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-label">레벨</span>
            <span className="stat-value">{gameState.level}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">아이돌</span>
            <span className="stat-value">{gameState.idols.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">팀</span>
            <span className="stat-value">{gameState.teams.length}</span>
          </div>
        </div>
      </div>

      {/* 리소스 카드 */}
      <div className="resources-grid">
        <div className="resource-card money">
          <div className="resource-icon">💰</div>
          <div className="resource-info">
            <div className="resource-label">자금</div>
            <div className="resource-value">{formatNumber(gameState.money)}</div>
          </div>
        </div>
        <div className="resource-card gems">
          <div className="resource-icon">💎</div>
          <div className="resource-info">
            <div className="resource-label">젬</div>
            <div className="resource-value">{gameState.gems}</div>
          </div>
        </div>
        <div className="resource-card fans">
          <div className="resource-icon">👥</div>
          <div className="resource-info">
            <div className="resource-label">팬</div>
            <div className="resource-value">{formatNumber(gameState.fans)}</div>
          </div>
        </div>
      </div>

      {/* 경험치 바 */}
      <div className="exp-section">
        <div className="exp-header">
          <span>경험치</span>
          <span>{Math.floor(gameState.experience)} / {nextLevelExp}</span>
        </div>
        <div className="exp-bar">
          <div className="exp-fill" style={{ width: `${expProgress}%` }}></div>
        </div>
      </div>

      {/* 메뉴 버튼 */}
      <div className="menu-grid">
        <button
          onClick={() => onNavigate('gacha')}
          className="menu-button gacha-btn"
        >
          <div className="btn-icon">🎰</div>
          <div className="btn-text">뽑기</div>
          <div className="btn-cost">5,000 💰</div>
        </button>
        <button
          onClick={() => onNavigate('idols')}
          className="menu-button idols-btn"
        >
          <div className="btn-icon">👨‍👩‍👧‍👦</div>
          <div className="btn-text">아이돌 관리</div>
          <div className="btn-count">{gameState.idols.length}명</div>
        </button>
        <button
          onClick={() => onNavigate('teams')}
          className="menu-button teams-btn"
        >
          <div className="btn-icon">🎭</div>
          <div className="btn-text">팀 구성</div>
          <div className="btn-count">{gameState.teams.length}팀</div>
        </button>
        <button
          onClick={() => onNavigate('concerts')}
          className="menu-button concerts-btn"
        >
          <div className="btn-icon">🎪</div>
          <div className="btn-text">콘서트</div>
          <div className="btn-cost">수익 증대</div>
        </button>
        <button
          onClick={() => onNavigate('facilities')}
          className="menu-button facilities-btn"
        >
          <div className="btn-icon">🏢</div>
          <div className="btn-text">시설 업그레이드</div>
          <div className="btn-count">{Object.values(gameState.facilities).reduce((a, b) => a + b, 0)}</div>
        </button>
      </div>

      {/* 일일 로그인 보너스 */}
      <div className="daily-bonus">
        <div className="bonus-title">📅 일일 로그인 보너스</div>
        <div className="bonus-streak">연속 {gameState.dailyLoginStreak}일</div>
        <div className="bonus-reward">내일 {1000 * (gameState.dailyLoginStreak + 1)} 💰 획득!</div>
      </div>
    </div>
  );
}
