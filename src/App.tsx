import { useState, useEffect, useCallback } from 'react';
import type { GameState, Idol } from './types/game';
import {
  loadGameState,
  saveGameState,
  createInitialState,
  performGacha,
  calculateOfflineEarnings,
  checkDailyLogin,
  checkPlayerLevelUp,
} from './utils/gameState';
import MainDashboard from './components/MainDashboard';
import GachaScreen from './components/GachaScreen';
import IdolManagement from './components/IdolManagement';
import TeamManagement from './components/TeamManagement';
import FacilityUpgrade from './components/FacilityUpgrade';
import ConcertHall from './components/ConcertHall';
import './App.css';

type Screen = 'dashboard' | 'gacha' | 'idols' | 'teams' | 'facilities' | 'concerts';

function App() {
  const [gameState, setGameState] = useState<GameState>(createInitialState());
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [gachaResult, setGachaResult] = useState<Idol | null>(null);

  // 게임 상태 로드 및 오프라인 수익 적용
  useEffect(() => {
    let loaded = loadGameState();
    
    // 일일 로그인 보너스 확인
    loaded = checkDailyLogin(loaded);
    
    // 오프라인 수익 계산
    const earnings = calculateOfflineEarnings(loaded);
    loaded.money += earnings.money;
    loaded.fans += earnings.fans;
    loaded.experience += earnings.experience;
    loaded.lastOfflineTime = Date.now();
    
    // 플레이어 레벨업 확인
    loaded = checkPlayerLevelUp(loaded);
    
    setGameState(loaded);
    saveGameState(loaded);
  }, []);

  // 자동 저장
  useEffect(() => {
    const interval = setInterval(() => {
      saveGameState(gameState);
    }, 10000);
    return () => clearInterval(interval);
  }, [gameState]);

  // 뽑기
  const handleGacha = useCallback(() => {
    if (gameState.money >= 5000) {
      const newIdol = performGacha();
      setGameState((prev) => ({
        ...prev,
        money: prev.money - 5000,
        idols: [...prev.idols, newIdol],
      }));
      setGachaResult(newIdol);
      saveGameState(gameState);
    }
  }, [gameState]);

  // 시설 업그레이드
  const handleUpgradeFacility = useCallback(
    (facility: keyof GameState['facilities']) => {
      const baseCost = 1000;
      const currentLevel = gameState.facilities[facility];
      const cost = Math.floor(baseCost * Math.pow(1.3, currentLevel));

      if (gameState.money >= cost) {
        setGameState((prev) => ({
          ...prev,
          money: prev.money - cost,
          facilities: {
            ...prev.facilities,
            [facility]: prev.facilities[facility] + 1,
          },
        }));
      }
    },
    [gameState]
  );

  // 아이돌 능력치 업그레이드
  const handleUpgradeIdolStat = useCallback(
    (idolId: string, stat: 'vocal' | 'dance' | 'rap' | 'visual') => {
      if (gameState.money >= 500) {
        setGameState((prev) => ({
          ...prev,
          money: prev.money - 500,
          idols: prev.idols.map((idol) =>
            idol.id === idolId ? { ...idol, [stat]: idol[stat] + 5 } : idol
          ),
        }));
      }
    },
    [gameState]
  );

  // 자동 수익 (매초)
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState((prev) => {
        let moneyPerSecond = 100;
        let fansPerSecond = 0.5;

        moneyPerSecond += prev.facilities.trainingRoom * 2;
        moneyPerSecond += prev.facilities.cafeteria * 1.5;
        fansPerSecond += prev.facilities.concertHall * 0.5;

        moneyPerSecond += prev.idols.length * 5;
        fansPerSecond += prev.idols.length * 2;

        prev.idols.forEach((idol) => {
          const totalStats = idol.vocal + idol.dance + idol.rap + idol.visual;
          moneyPerSecond += totalStats * 0.2;
          fansPerSecond += totalStats * 0.1;
        });

        return {
          ...prev,
          money: prev.money + moneyPerSecond,
          fans: prev.fans + fansPerSecond,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app">
      {currentScreen === 'dashboard' && (
        <MainDashboard
          gameState={gameState}
          onNavigate={(screen) => setCurrentScreen(screen as Screen)}
        />
      )}
      {currentScreen === 'gacha' && (
        <GachaScreen
          gameState={gameState}
          gachaResult={gachaResult}
          onGacha={handleGacha}
          onBack={() => {
            setCurrentScreen('dashboard');
            setGachaResult(null);
          }}
        />
      )}
      {currentScreen === 'idols' && (
        <IdolManagement
          gameState={gameState}
          onUpgradeStat={handleUpgradeIdolStat}
          onBack={() => setCurrentScreen('dashboard')}
        />
      )}
      {currentScreen === 'teams' && (
        <TeamManagement
          gameState={gameState}
          onBack={() => setCurrentScreen('dashboard')}
          setGameState={setGameState}
        />
      )}
      {currentScreen === 'facilities' && (
        <FacilityUpgrade
          gameState={gameState}
          onUpgradeFacility={handleUpgradeFacility}
          onBack={() => setCurrentScreen('dashboard')}
        />
      )}
      {currentScreen === 'concerts' && (
        <ConcertHall
          gameState={gameState}
          onBack={() => setCurrentScreen('dashboard')}
          setGameState={setGameState}
        />
      )}
    </div>
  );
}

export default App;
