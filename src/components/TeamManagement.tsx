import { useState } from 'react';
import type { GameState } from '../types/game';

interface TeamManagementProps {
  gameState: GameState;
  onBack: () => void;
  setGameState: (state: GameState) => void;
}

export default function TeamManagement({
  gameState,
  onBack,
  setGameState,
}: TeamManagementProps) {
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedIdols, setSelectedIdols] = useState<string[]>([]);

  const handleCreateTeam = () => {
    if (newTeamName.trim() && selectedIdols.length > 0) {
      const newTeam = {
        id: `team-${Date.now()}`,
        name: newTeamName,
        members: selectedIdols,
        level: 1,
        fans: 0,
        synergy: 0,
        createdAt: Date.now(),
      };

      setGameState({
        ...gameState,
        teams: [...gameState.teams, newTeam],
      });

      setNewTeamName('');
      setSelectedIdols([]);
    }
  };

  const toggleIdolSelection = (idolId: string) => {
    setSelectedIdols((prev) =>
      prev.includes(idolId) ? prev.filter((id) => id !== idolId) : [...prev, idolId]
    );
  };

  return (
    <div className="team-management">
      <div className="management-header">
        <h1>🎭 팀 구성</h1>
        <div className="team-count">총 {gameState.teams.length}팀</div>
      </div>

      {/* 새 팀 생성 */}
      <div className="create-team-section">
        <h2>새 팀 생성</h2>
        <div className="create-team-form">
          <input
            type="text"
            placeholder="팀 이름 입력"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            className="team-name-input"
          />

          <div className="idol-selection">
            <h3>아이돌 선택 (최소 2명)</h3>
            <div className="idol-list">
              {gameState.idols.map((idol) => (
                <button
                  key={idol.id}
                  onClick={() => toggleIdolSelection(idol.id)}
                  className={`idol-select-btn ${selectedIdols.includes(idol.id) ? 'selected' : ''}`}
                >
                  <span>{idol.name}</span>
                  <span className="idol-level">Lv.{idol.level}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleCreateTeam}
            disabled={!newTeamName.trim() || selectedIdols.length < 2}
            className="btn-primary"
          >
            팀 생성
          </button>
        </div>
      </div>

      {/* 팀 목록 */}
      <div className="teams-list-section">
        <h2>팀 목록</h2>
        {gameState.teams.length === 0 ? (
          <div className="empty-state">
            <p>아직 팀이 없습니다.</p>
          </div>
        ) : (
          <div className="teams-grid">
            {gameState.teams.map((team) => (
              <div key={team.id} className="team-card">
                <div className="team-header">
                  <h3>{team.name}</h3>
                  <span className="team-level">Lv. {team.level}</span>
                </div>
                <div className="team-members">
                  <span className="members-count">멤버: {team.members.length}명</span>
                </div>
                <div className="team-stats">
                  <div className="stat">
                    <span>👥 팬:</span>
                    <span>{Math.floor(team.fans).toLocaleString()}</span>
                  </div>
                  <div className="stat">
                    <span>⚡ 시너지:</span>
                    <span>{team.synergy}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={onBack} className="btn-back">
        ← 돌아가기
      </button>
    </div>
  );
}
