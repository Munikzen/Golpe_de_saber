import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Card from './UIComponents/Card';
import CorrectButton from './UIComponents/CorrectButton';
import WrongButton from './UIComponents/WrongButton';
import ShowAnswerButton from './UIComponents/ShowAnswerButton';
import PlayerCard from './UIComponents/PlayerCard';
import OrangeRounded from './img/Orange_rounded_100.png';
import BlueRounded from './img/Blue_rounded_100.png';
import RedRounded from './img/Red_rounded_100.png';
import GreenRounded from './img/Green_rounded_100.png';
import DeathIcon from './img/Death_icon.png';
import SilenceIcon from './img/Silence_icon.png';
import AbilityShield from './img/Ability_shield.png';
import AbilitySilence from './img/Ability_silence.png';
import AbilityX2 from './img/Ability_x2.png';
import ManualButton from './UIComponents/ManualButton';
import Credits from './UIComponents/Credits';
import GenericGameMode from './UIComponents/GenericGameMode';
import './App.css';

function App() {
  const [questions, setQuestions] = useState([]);
  const [searchParams] = useSearchParams();
  const [gameMode, setGameMode] = useState('loading');



  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isAnimatingAnswer, setIsAnimatingAnswer] = useState(false);

  const [gamePhase, setGamePhase] = useState('select-player');
  const [activePlayerId, setActivePlayerId] = useState(null);
  const [targetPlayerId, setTargetPlayerId] = useState(null);

  const [players, setPlayers] = useState([
    { id: 1, name: 'Equipo 1', hp: 0, maxHp: 0, shield: false, abilities: { shield: false, silence: false, x2: false }, color: OrangeRounded },
    { id: 2, name: 'Equipo 2', hp: 0, maxHp: 0, shield: false, abilities: { shield: false, silence: false, x2: false }, color: BlueRounded },
    { id: 3, name: 'Equipo 3', hp: 0, maxHp: 0, shield: false, abilities: { shield: false, silence: false, x2: false }, color: RedRounded },
    { id: 4, name: 'Equipo 4', hp: 0, maxHp: 0, shield: false, abilities: { shield: false, silence: false, x2: false }, color: GreenRounded }
  ]);

  const [damagedPlayers, setDamagedPlayers] = useState(new Set());

  const [abilityChance, setAbilityChance] = useState(100);
  const [showAbilityIcon, setShowAbilityIcon] = useState(false);
  const [availableAbility, setAvailableAbility] = useState(null);
  const [silencedPlayers, setSilencedPlayers] = useState(new Set());
  const [newlySilencedPlayers, setNewlySilencedPlayers] = useState(new Set());
  const [gamePhaseBeforeAbility, setGamePhaseBeforeAbility] = useState(null);
  const [playerUsingAbility, setPlayerUsingAbility] = useState(null);
  const [activeAbilityType, setActiveAbilityType] = useState(null);
  const [playersWithNewAbilities, setPlayersWithNewAbilities] = useState(new Set());

  const [isGameWon, setIsGameWon] = useState(false);
  const [winnerPlayer, setWinnerPlayer] = useState(null);
  const [gameCompleted, setGameCompleted] = useState(false);

  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [allQuestionsCompleted, setAllQuestionsCompleted] = useState(false);

  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getPlayerCardDimensions = () => {
    const { width } = screenSize;

    if (width <= 480) {
      return { width: 280, height: 196 };
    } else if (width <= 767) {
      return { width: 320, height: 224 };
    } else if (width <= 1023) {
      return { width: 390, height: 273 };
    } else if (width <= 1199) {
      return { width: 440, height: 308 };
    } else if (width <= 1399) {
      return { width: 360, height: 252 };
    } else {
      return { width: 490, height: 343 };
    }
  };

  const getButtonDimensions = () => {
    const { width } = screenSize;

    if (width <= 480) {
      return { width: 90, height: 60 };
    } else if (width <= 767) {
      return { width: 100, height: 65 };
    } else if (width <= 1023) {
      return { width: 110, height: 70 };
    } else if (width <= 1399) {
      return { width: 115, height: 75 };
    } else {
      return { width: 120, height: 80 };
    }
  };

  const getCardDimensions = () => {
    const { width } = screenSize;

    let dimensions;

    if (width <= 480) {
      dimensions = { width: 300, height: 395 };
    } else if (width <= 767) {
      dimensions = { width: 350, height: 460 };
    } else if (width <= 1023) {
      dimensions = { width: 450, height: 592 };
    } else if (width <= 1199) {
      dimensions = { width: 550, height: 724 };
    } else if (width <= 1399) {
      dimensions = { width: 580, height: 760 };
    } else {
      dimensions = { width: 660, height: 870 };
    }

    return dimensions;
  };

  const themesString = useMemo(() => searchParams.getAll('themes').join(','), [searchParams]);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const calculatePlayerHealth = (totalQuestions) => {
    const healthPerPlayer = Math.max(2, Math.floor(totalQuestions / 4));
    const extraQuestions = totalQuestions % 4;

    console.log(`Total preguntas: ${totalQuestions}, Vida por jugador: ${healthPerPlayer}, Extra: ${extraQuestions}`);

    return healthPerPlayer;
  };

  const isPlayerDead = (player) => {
    return player.hp <= 0;
  };

  const getAlivePlayers = useCallback(() => {
    return players.filter(player => !isPlayerDead(player));
  }, [players]);

  useEffect(() => {
    if (gameMode === 'with-questions' && !gameCompleted) {
      const alivePlayers = getAlivePlayers();

      if (alivePlayers.length === 1 && !isGameWon) {
        setIsGameWon(true);
        setWinnerPlayer(alivePlayers[0]);
        console.log('Game won by:', alivePlayers[0].name);
      } else if (alivePlayers.length === 0) {
        setGameCompleted(true);
        console.log('Game ended - all players eliminated');
      }
    }
  }, [players, gameMode, gameCompleted, isGameWon, getAlivePlayers]);

  useEffect(() => {
    const themes = themesString ? themesString.split(',') : [];

    if (themes.length === 0) {
      setGameMode('without-questions');
      return;
    }

    const initializePlayersHealthLocal = (totalQuestions) => {
      const healthPerPlayer = calculatePlayerHealth(totalQuestions);

      console.log(`Inicializando jugadores con ${healthPerPlayer} HP cada uno`);

      setPlayers(prevPlayers =>
        prevPlayers.map((player, index) => ({
          ...player,
          hp: healthPerPlayer,
          maxHp: healthPerPlayer
        }))
      );
    };

    const fetchQuestions = async () => {
      try {
        console.log("Fetching questions for themes:", themes);
        const ids = themes.join('&themes=');
        const response = await fetch(
          `http://148.206.168.178/vaep/api/v1/question/theme?themes=${ids}`
        );
        const data = await response.json();
        let openQs = [];
        let mcQs = [];

        console.log("Fetched data:", data);

        const themeData = data.data;

        if (Array.isArray(themeData)) {
          themeData.forEach(theme => {
            if (theme.openQuestions) {
              const dataQsOp = theme.openQuestions.map((q) => ({
                type: "open",
                question: q.question,
                answer: q.answer,
              }));
              openQs.push(...dataQsOp);
            }

            if (theme.multipleChoiceQuestions) {
              const dataMCsOp = theme.multipleChoiceQuestions.map((q) => ({
                type: "mc",
                question: q.question,
                options: q.answers,
                correctAnswer: q.correctAnswer,
              }));
              mcQs.push(...dataMCsOp);
            }
          });
        } else {
          if (themeData.openQuestions) {
            const dataQsOp = themeData.openQuestions.map((q) => ({
              type: "open",
              question: q.question,
              answer: q.answer,
            }));
            openQs.push(...dataQsOp);
          }

          if (themeData.multipleChoiceQuestions) {
            const dataMCsOp = themeData.multipleChoiceQuestions.map((q) => ({
              type: "mc",
              question: q.question,
              options: q.answers,
              correctAnswer: q.correctAnswer,
            }));
            mcQs.push(...dataMCsOp);
          }
        }

        console.log("Open Questions:", openQs);
        console.log("Multiple Choice Questions:", mcQs);
        const allQuestions = [...openQs, ...mcQs];
        setQuestions(allQuestions);
        const shuffled = shuffleArray(allQuestions);
        setShuffledQuestions(shuffled);

        initializePlayersHealthLocal(allQuestions.length);

        setGameMode('with-questions');
      } catch (error) {
        console.error("Error al cargar preguntas:", error);
        setGameMode('without-questions');
      }
    };

    fetchQuestions();
  }, [themesString]);

  useEffect(() => {
    console.log("Questions loaded:", questions);
  }, [questions]);

  const handlePlayerSelect = (playerId) => {
    const selectedPlayer = players.find(p => p.id === playerId);

    if (isPlayerDead(selectedPlayer)) {
      return;
    }

    if (isGameWon) {
      if (playerId === winnerPlayer?.id && gamePhase === 'select-player') {
        setActivePlayerId(playerId);
        setGamePhase('player-selected');
      }
      return;
    }

    if (gamePhase === 'select-player') {
      setActivePlayerId(playerId);
      setGamePhase('player-selected');
    } else if (gamePhase === 'player-selected') {
      setActivePlayerId(playerId);
    } else if (gamePhase === 'select-target') {
      setTargetPlayerId(playerId);
      dealDamageToPlayer(playerId, activePlayerId);
      nextTurn();
    } else if (gamePhase === 'ability-silence') {
      applySilence(playerId);
    }
  };



  const dealDamageToPlayer = (playerId, sourcePlayerId = null) => {
    if (isGameWon) {
      console.log('Game is won, no damage dealt');
      return;
    }

    setDamagedPlayers(prev => new Set(prev).add(playerId));

    let damage = 1;

    if (sourcePlayerId) {
      const sourcePlayer = players.find(p => p.id === sourcePlayerId);
      if (sourcePlayer && sourcePlayer.x2Active) {
        damage = 2;
        setPlayers(prevPlayers =>
          prevPlayers.map(player =>
            player.id === sourcePlayerId
              ? { ...player, x2Active: false }
              : player
          )
        );
      }
    }

    setPlayers(prevPlayers =>
      prevPlayers.map(player => {
        if (player.id === playerId) {
          if (player.shield) {
            return { ...player, shield: false };
          } else {
            return { ...player, hp: Math.max(0, player.hp - damage) };
          }
        }
        return player;
      })
    );

    setTimeout(() => {
      setDamagedPlayers(prev => {
        const newSet = new Set(prev);
        newSet.delete(playerId);
        return newSet;
      });
    }, 600);
  };

  const handleCorrectAnswer = () => {
    if (!isGameWon && showAbilityIcon && availableAbility && activePlayerId) {
      setPlayers(prevPlayers =>
        prevPlayers.map(player =>
          player.id === activePlayerId
            ? { ...player, abilities: { ...player.abilities, [availableAbility]: true } }
            : player
        )
      );

      setPlayersWithNewAbilities(prev => new Set(prev).add(activePlayerId));
      setShowAbilityIcon(false);
      setAvailableAbility(null);
    }

    if (isGameWon) {
      nextTurn();
    } else {
      setGamePhase('select-target');
    }
  };

  const handleWrongAnswer = () => {
    if (isGameWon) {
      nextTurn();
    } else {
      dealDamageToPlayer(activePlayerId, activePlayerId);
      nextTurnSameQuestion();
    }
  };

  const handleShowAnswer = () => {
    if (isCardFlipped && !showAnswer) {
      setIsAnimatingAnswer(true);
      setTimeout(() => {
        setShowAnswer(true);
        setIsAnimatingAnswer(false);
      }, 50);
    }
  };

  const handleAbilityActivation = (playerId, abilityType) => {
    if (isGameWon) {
      console.log('Game is won, abilities disabled');
      return;
    }

    const player = players.find(p => p.id === playerId);

    if (!player || !player.abilities[abilityType]) {
      console.log('Player or ability not found');
      return;
    }
    if (playerId !== activePlayerId) {
      console.log('Only active player can use abilities');
      return;
    }
    if (!isCardFlipped) {
      console.log('Card must be flipped to use abilities');
      return;
    }
    if (gamePhase !== 'answer-question' && gamePhase !== 'select-target') {
      console.log('Wrong game phase for abilities:', gamePhase);
      return;
    }

    console.log('Activating ability:', abilityType, 'for player:', playerId);

    setPlayerUsingAbility(playerId);
    setActiveAbilityType(abilityType);
    setGamePhaseBeforeAbility(gamePhase);

    if (abilityType === 'shield') {
      activateShield(playerId);
    } else if (abilityType === 'silence') {
      setGamePhase('ability-silence');
    } else if (abilityType === 'x2') {
      activateX2(playerId);
    }
  };
  const activateShield = (playerId) => {
    setPlayers(prevPlayers =>
      prevPlayers.map(player =>
        player.id === playerId
          ? {
            ...player,
            shield: true,
            abilities: { ...player.abilities, shield: false }
          }
          : player
      )
    );
    resetAbilityState();
  };

  const activateX2 = (playerId) => {
    setPlayers(prevPlayers =>
      prevPlayers.map(player =>
        player.id === playerId
          ? {
            ...player,
            x2Active: true,
            abilities: { ...player.abilities, x2: false }
          }
          : player
      )
    );
    resetAbilityState();
  };

  const applySilence = (targetPlayerId) => {
    if (playerUsingAbility && activeAbilityType === 'silence') {
      setSilencedPlayers(prev => new Set(prev).add(targetPlayerId));

      setNewlySilencedPlayers(prev => new Set(prev).add(targetPlayerId));

      setPlayers(prevPlayers =>
        prevPlayers.map(player =>
          player.id === playerUsingAbility
            ? { ...player, abilities: { ...player.abilities, silence: false } }
            : player
        )
      );
      resetAbilityState();
    }
  };

  const resetAbilityState = () => {
    const previousPhase = gamePhaseBeforeAbility;
    setPlayerUsingAbility(null);
    setActiveAbilityType(null);
    setGamePhaseBeforeAbility(null);

    if (previousPhase && (previousPhase === 'answer-question' || previousPhase === 'select-target')) {
      setGamePhase(previousPhase);
    } else {
      if (isCardFlipped && activePlayerId) {
        setGamePhase('answer-question');
      } else {
        setGamePhase('select-player');
      }
    }

    console.log('Reset ability state, returning to phase:', previousPhase || 'fallback');
  };

  const handleCardClick = () => {
    if (allQuestionsCompleted) {
      return;
    }
    if ((gamePhase === 'player-selected' && activePlayerId && !isCardFlipped) ||
      (isGameWon && activePlayerId && !isCardFlipped)) {
      setIsCardFlipped(true);
      setGamePhase('answer-question');

      const currentQuestion = getCurrentQuestion();
      console.log('Current question:', currentQuestion);
      console.log('Question type:', currentQuestion?.type);

      if (currentQuestion) {
        if (isGameWon) {
          console.log('Game is won, no abilities given');
          setAvailableAbility(null);
          setShowAbilityIcon(false);
        } else {
          const random = Math.random() * 100;
          console.log('Random value:', random, 'Ability chance:', abilityChance);

          if (random < abilityChance) {
            const abilities = ['shield', 'silence', 'x2'];
            const randomAbility = abilities[Math.floor(Math.random() * abilities.length)];
            console.log('Ability assigned:', randomAbility);
            setAvailableAbility(randomAbility);
            setShowAbilityIcon(true);
          } else {
            console.log('No ability this time');
            setAvailableAbility(null);
            setShowAbilityIcon(false);
          }
        }
      } else {
        console.log('No current question');
        setAvailableAbility(null);
        setShowAbilityIcon(false);
      }
    }
  };
  const nextTurnSameQuestion = () => {
    setIsCardFlipped(false);

    setShowAnswer(false);
    setIsAnimatingAnswer(false);
    setActivePlayerId(null);
    setTargetPlayerId(null);
    setGamePhase('select-player');

    setShowAbilityIcon(false);
    setAvailableAbility(null);

    setSilencedPlayers(newlySilencedPlayers);

    setNewlySilencedPlayers(new Set());

    setPlayersWithNewAbilities(new Set());
  };

  const nextTurn = () => {
    setAnsweredQuestions(prev => new Set(prev).add(currentQuestionIndex));

    setIsCardFlipped(false);
    setShowAnswer(false);
    setIsAnimatingAnswer(false);
    setActivePlayerId(null);
    setTargetPlayerId(null);
    setGamePhase('select-player');

    setShowAbilityIcon(false);
    setAvailableAbility(null);

    setSilencedPlayers(newlySilencedPlayers);
    setNewlySilencedPlayers(new Set());
    setPlayersWithNewAbilities(new Set());

    setTimeout(() => {
      const nextIndex = getNextUnAnsweredQuestionIndex();
      if (nextIndex === -1) {
        setAllQuestionsCompleted(true);
        console.log('All questions completed!');
      } else {
        setCurrentQuestionIndex(nextIndex);
      }
    }, 600);
  };

  const getCurrentQuestion = () => {
    if (shuffledQuestions.length === 0) return null;
    return shuffledQuestions[currentQuestionIndex];
  };

  const getNextUnAnsweredQuestionIndex = () => {
    if (shuffledQuestions.length === 0) return -1;
    for (let i = currentQuestionIndex + 1; i < shuffledQuestions.length; i++) {
      if (!answeredQuestions.has(i)) {
        return i;
      }
    }
    for (let i = 0; i < currentQuestionIndex; i++) {
      if (!answeredQuestions.has(i)) {
        return i;
      }
    }
    return -1;
  };

  const renderGameContent = () => {
    switch (gameMode) {
      case 'loading':
        return (
          <div className="main-game-container">
            <ManualButton />
            <Credits />

            <p>Cargando...</p>
          </div>
        );

      case 'with-questions':
        const currentQuestion = getCurrentQuestion();
        if (!currentQuestion) {
          return (
            <div className="main-game-container">
              <h1>Golpe de Saber</h1>
              <p>Cargando preguntas...</p>
            </div>
          );
        }

        return (
          <div className="main-game-container">
            <ManualButton />
            <Credits />

            <div className="game-layout">
              <div className="left-side">
                <div className="card-and-ability-container">
                  <div className="card-section">
                    <Card
                      isFlipped={isCardFlipped}
                      onClick={handleCardClick}
                      question={currentQuestion.question}
                      width={getCardDimensions().width}
                      height={getCardDimensions().height}
                    >
                      {isCardFlipped && currentQuestion.type === 'mc' && !showAnswer && (
                        <div className="multiple-choice-display">
                          {currentQuestion.options.map((option, index) => (
                            <div key={index} className="option-item">
                              <strong>{String.fromCharCode(65 + index)})</strong> {option}
                            </div>
                          ))}
                        </div>
                      )}

                      {showAnswer && (
                        <div className="answer-display">
                          <strong>Respuesta:</strong>
                          <p>{currentQuestion.answer || currentQuestion.correctAnswer}</p>
                        </div>
                      )}
                    </Card>
                  </div>
                </div>
              </div>
              <div className="center-column">
                {showAbilityIcon && availableAbility && (
                  <div className="ability-reward-display-center">
                    <p>¡RECOMPENSA!</p>
                    <div className="ability-icon-reward">
                      <img
                        src={availableAbility === 'shield' ? AbilityShield :
                          availableAbility === 'silence' ? AbilitySilence : AbilityX2}
                        alt={`Habilidad ${availableAbility}`}
                        className="ability-reward-icon"
                      />
                    </div>
                  </div>
                )}
                {(activeAbilityType || players.some(p => p.x2Active)) && (
                  <div className="active-ability-display-center">
                    {players.some(p => p.x2Active) && !activeAbilityType && (
                      <div className="active-ability-indicator">
                        <p>¡X2 ACTIVO!</p>
                        <div className="ability-icon-active">
                          <img
                            src={AbilityX2}
                            alt="X2 Activo"
                            className="ability-active-icon pulsing"
                          />
                        </div>
                      </div>
                    )}
                    {activeAbilityType === 'silence' && gamePhase === 'ability-silence' && (
                      <div className="active-ability-indicator">
                        <p>SELECCIONA OBJETIVO</p>
                        <div className="ability-icon-active">
                          <img
                            src={AbilitySilence}
                            alt="Silencio Activo"
                            className="ability-active-icon pulsing"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="game-buttons-column">
                  <div className="buttons-column-title">
                    <p>Respuestas</p>
                  </div>
                  <CorrectButton
                    onClick={handleCorrectAnswer}
                    width={getButtonDimensions().width}
                    height={getButtonDimensions().height}
                    disabled={allQuestionsCompleted || !isCardFlipped || gamePhase !== 'answer-question'}
                  />
                  <ShowAnswerButton
                    onClick={handleShowAnswer}
                    width={getButtonDimensions().width}
                    height={getButtonDimensions().height}
                    disabled={allQuestionsCompleted || !isCardFlipped || showAnswer || gamePhase !== 'answer-question'}
                  />
                  <WrongButton
                    onClick={handleWrongAnswer}
                    width={getButtonDimensions().width}
                    height={getButtonDimensions().height}
                    disabled={allQuestionsCompleted || !isCardFlipped || gamePhase !== 'answer-question'}
                  />
                </div>
              </div>
              <div className="right-side">
                <div className="game-instructions">
                  {allQuestionsCompleted ? (
                    <div className="completion-message">
                      <div style={{
                        background: 'linear-gradient(45deg, #4CAF50, #45a049)',
                        padding: '20px',
                        borderRadius: '15px',
                        border: '3px solid #4CAF50',
                        boxShadow: '0 0 20px rgba(76, 175, 80, 0.8)',
                        animation: 'abilityGlow 2s infinite alternate',
                        textAlign: 'center'
                      }}>
                        <h2 style={{
                          color: '#fff',
                          margin: '0 0 10px 0',
                          fontSize: '1.8rem',
                          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
                        }}>
                          📚 ¡TODAS LAS PREGUNTAS COMPLETADAS! 📚
                        </h2>
                        <p style={{
                          color: '#fff',
                          margin: '0',
                          fontSize: '1.2rem',
                          fontWeight: 'bold',
                          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
                        }}>
                          {isGameWon ? `${winnerPlayer?.name} ganó y ` : ''}se han revisado todas las preguntas disponibles
                        </p>
                      </div>
                    </div>
                  ) : isGameWon && winnerPlayer ? (
                    <div className="win-message">
                      <div style={{
                        background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                        padding: '20px',
                        borderRadius: '15px',
                        border: '3px solid #FFD700',
                        boxShadow: '0 0 20px rgba(255, 215, 0, 0.8)',
                        animation: 'abilityGlow 2s infinite alternate',
                        textAlign: 'center'
                      }}>
                        <h2 style={{
                          color: '#fff',
                          margin: '0 0 10px 0',
                          fontSize: '1.8rem',
                          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
                        }}>
                          🏆 ¡VICTORIA! 🏆
                        </h2>
                        <p style={{
                          color: '#fff',
                          margin: '0 0 15px 0',
                          fontSize: '1.3rem',
                          fontWeight: 'bold',
                          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
                        }}>
                          {winnerPlayer.name} ha ganado la partida
                        </p>
                        <p style={{
                          color: '#fff',
                          margin: '0',
                          fontSize: '1rem',
                          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
                        }}>
                          Puedes continuar viendo las preguntas restantes
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {gamePhase === 'select-player' && !isGameWon && (
                        <p>Selecciona el jugador que va a responder</p>
                      )}
                      {gamePhase === 'select-player' && isGameWon && (
                        <p>Selecciona al ganador para continuar viendo preguntas</p>
                      )}
                      {gamePhase === 'player-selected' && (
                        <p>{players.find(p => p.id === activePlayerId)?.name} seleccionado. Haz clic en la carta para voltearla</p>
                      )}
                      {gamePhase === 'answer-question' && (
                        <div>
                          <p>{isGameWon ? 'Modo revisión - ' : 'Turno de '}{players.find(p => p.id === activePlayerId)?.name}</p>
                          {isCardFlipped && !isGameWon && (
                            <p style={{ fontSize: '0.9rem', color: '#FFD700' }}>
                              💫 Puedes usar tus habilidades haciendo clic en los íconos
                            </p>
                          )}
                          {isCardFlipped && isGameWon && (
                            <p style={{ fontSize: '0.9rem', color: '#87CEEB' }}>
                              📚 Modo revisión - Sin combate ni habilidades
                            </p>
                          )}
                        </div>
                      )}
                      {gamePhase === 'select-target' && !isGameWon && (
                        <p>¡Correcto! Selecciona a quién atacar</p>
                      )}
                      {gamePhase === 'ability-silence' && !isGameWon && (
                        <p>Selecciona a quién silenciar</p>
                      )}
                    </>
                  )}
                </div>

                <div className="players-grid">
                  {players.map((player) => {
                    const isDead = isPlayerDead(player);
                    const isSilenced = silencedPlayers.has(player.id);
                    const isActive = player.id === activePlayerId && !isDead;
                    const isDamaged = damagedPlayers.has(player.id);
                    const isSelectable = !isDead && (
                      (isGameWon && player.id === winnerPlayer?.id && gamePhase === 'select-player') ||
                      (!isGameWon && (
                        (gamePhase === 'select-player' && !isSilenced) ||
                        (gamePhase === 'player-selected' && !isSilenced) ||
                        (gamePhase === 'select-target' && player.id !== activePlayerId) ||
                        (gamePhase === 'ability-silence' && player.id !== playerUsingAbility)
                      ))
                    );

                    return (
                      <div
                        key={player.id}
                        className={`player-card-wrapper ${isActive ? 'active-player' : ''} ${isSelectable ? 'selectable-player' : ''} ${isDead ? 'dead-player' : ''} ${isDamaged ? 'damaged-player' : ''} ${isSilenced ? 'silenced-player' : ''}`}
                        onClick={() => isSelectable ? handlePlayerSelect(player.id) : null}
                      >
                        <PlayerCard
                          playerName={player.name}
                          hp={player.hp}
                          maxHp={player.maxHp}
                          shield={player.shield}
                          abilities={player.abilities}
                          background={player.color}
                          width={getPlayerCardDimensions().width}
                          height={getPlayerCardDimensions().height}
                          onAbilityClick={(abilityType) => handleAbilityActivation(player.id, abilityType)}
                          canUseAbilities={
                            !isGameWon &&
                            player.id === activePlayerId &&
                            isCardFlipped &&
                            (gamePhase === 'answer-question' || gamePhase === 'select-target') &&
                            !playersWithNewAbilities.has(player.id)
                          }
                        />
                        {isDead && (
                          <div className="death-overlay">
                            <img
                              src={DeathIcon}
                              alt="Dead"
                              className="death-icon"
                            />
                          </div>
                        )}
                        {isSilenced && !isDead && (
                          <div className="silence-overlay">
                            <img
                              src={SilenceIcon}
                              alt="Silenced"
                              className="silence-icon"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      case 'without-questions':
        return (
          <>
            <ManualButton />
            <Credits />
            <GenericGameMode
              screenSize={screenSize}
              getPlayerCardDimensions={getPlayerCardDimensions}
              getButtonDimensions={getButtonDimensions}
              getCardDimensions={getCardDimensions}
            />
          </>
        );

      default:
        return (
          <div className="main-game-container">
            <Credits />
            <p>Error al cargar el juego</p>
          </div>
        );
    }
  };

  return (
    <div className="App">
      {renderGameContent()}
    </div>
  );
}

export default App;
