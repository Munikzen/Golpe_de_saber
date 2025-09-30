import React, { useState, useEffect, useCallback } from 'react';
import Card from './Card';
import CorrectButton from './CorrectButton';
import WrongButton from './WrongButton';
import ShowAnswerButton from './ShowAnswerButton';
import PlayerCard from './PlayerCard';
import OrangeRounded from '../img/Orange_rounded_100.png';
import BlueRounded from '../img/Blue_rounded_100.png';
import RedRounded from '../img/Red_rounded_100.png';
import GreenRounded from '../img/Green_rounded_100.png';
import DeathIcon from '../img/Death_icon.png';
import SilenceIcon from '../img/Silence_icon.png';
import AbilityShield from '../img/Ability_shield.png';
import AbilitySilence from '../img/Ability_silence.png';
import AbilityX2 from '../img/Ability_x2.png';

const genericQuestions = [
    {
        type: "open",
        question: "¿Cuál es la capital de España?",
        answer: "Madrid"
    },
    {
        type: "mc",
        question: "¿En qué año se descubrió América?",
        options: ["1490", "1491", "1492", "1493"],
        correctAnswer: "1492"
    },
    {
        type: "open",
        question: "¿Cuál es el océano más grande del mundo?",
        answer: "Océano Pacífico"
    },
    {
        type: "mc",
        question: "¿Cuántos continentes hay en el mundo?",
        options: ["5", "6", "7", "8"],
        correctAnswer: "7"
    },
    {
        type: "open",
        question: "¿Cuál es el río más largo del mundo?",
        answer: "Río Nilo"
    },
    {
        type: "mc",
        question: "¿Cuál es el planeta más cercano al Sol?",
        options: ["Venus", "Tierra", "Mercurio", "Marte"],
        correctAnswer: "Mercurio"
    },
    {
        type: "open",
        question: "¿En qué país se encuentran las pirámides de Giza?",
        answer: "Egipto"
    },
    {
        type: "mc",
        question: "¿Cuál es el metal más abundante en la corteza terrestre?",
        options: ["Hierro", "Aluminio", "Cobre", "Oro"],
        correctAnswer: "Aluminio"
    },
    {
        type: "open",
        question: "¿Cuál es la moneda oficial de Japón?",
        answer: "Yen"
    },
    {
        type: "mc",
        question: "¿En qué año terminó la Segunda Guerra Mundial?",
        options: ["1944", "1945", "1946", "1947"],
        correctAnswer: "1945"
    },
    {
        type: "open",
        question: "¿Cuál es el animal terrestre más rápido del mundo?",
        answer: "Guepardo"
    },
    {
        type: "mc",
        question: "¿Cuántos huesos tiene el cuerpo humano adulto aproximadamente?",
        options: ["150", "206", "300", "400"],
        correctAnswer: "206"
    },
    {
        type: "open",
        question: "¿Cuál es el idioma más hablado en el mundo?",
        answer: "Chino mandarín"
    },
    {
        type: "mc",
        question: "¿Cuál es la montaña más alta del mundo?",
        options: ["K2", "Everest", "Kangchenjunga", "Makalu"],
        correctAnswer: "Everest"
    },
    {
        type: "open",
        question: "¿En qué continente se encuentra el desierto del Sahara?",
        answer: "África"
    },
    {
        type: "mc",
        question: "¿Cuál es el órgano más grande del cuerpo humano?",
        options: ["Hígado", "Cerebro", "Pulmones", "Piel"],
        correctAnswer: "Piel"
    },
    {
        type: "open",
        question: "¿Cuál es la obra más famosa de Miguel de Cervantes?",
        answer: "Don Quijote de la Mancha"
    },
    {
        type: "mc",
        question: "¿En qué año se fundó la ONU?",
        options: ["1944", "1945", "1946", "1947"],
        correctAnswer: "1945"
    },
    {
        type: "open",
        question: "¿Cuál es la fórmula química del agua?",
        answer: "H2O"
    },
    {
        type: "mc",
        question: "¿Cuántos minutos tiene un día?",
        options: ["1440", "1400", "1480", "1500"],
        correctAnswer: "1440"
    }
];

const GenericGameMode = ({ screenSize, getPlayerCardDimensions, getButtonDimensions, getCardDimensions }) => {

    const [shuffledQuestions, setShuffledQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isCardFlipped, setIsCardFlipped] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);
    const [isAnimatingAnswer, setIsAnimatingAnswer] = useState(false);

    const [gamePhase, setGamePhase] = useState('select-player');
    const [activePlayerId, setActivePlayerId] = useState(null);

    const [players, setPlayers] = useState([
        { id: 1, name: 'Equipo 1', hp: 10, maxHp: 10, shield: false, x2Active: false, abilities: { shield: false, silence: false, x2: false }, color: OrangeRounded },
        { id: 2, name: 'Equipo 2', hp: 10, maxHp: 10, shield: false, x2Active: false, abilities: { shield: false, silence: false, x2: false }, color: BlueRounded },
        { id: 3, name: 'Equipo 3', hp: 10, maxHp: 10, shield: false, x2Active: false, abilities: { shield: false, silence: false, x2: false }, color: RedRounded },
        { id: 4, name: 'Equipo 4', hp: 10, maxHp: 10, shield: false, x2Active: false, abilities: { shield: false, silence: false, x2: false }, color: GreenRounded }
    ]);

    const [damagedPlayers, setDamagedPlayers] = useState(new Set());
    const [abilityChance, setAbilityChance] = useState(100);
    const [showAbilityIcon, setShowAbilityIcon] = useState(false);
    const [availableAbility, setAvailableAbility] = useState(null);
    const [silencedPlayers, setSilencedPlayers] = useState(new Map()); // Map of playerId -> turnsRemaining
    const [gamePhaseBeforeAbility, setGamePhaseBeforeAbility] = useState(null);
    const [playerUsingAbility, setPlayerUsingAbility] = useState(null);
    const [activeAbilityType, setActiveAbilityType] = useState(null);
    const [playersWithNewAbilities, setPlayersWithNewAbilities] = useState(new Set());

    const [isGameWon, setIsGameWon] = useState(false);
    const [winnerPlayer, setWinnerPlayer] = useState(null);
    const [gameCompleted, setGameCompleted] = useState(false);

    const shuffleArray = useCallback((array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }, []);

    const isPlayerDead = (player) => {
        return player.hp <= 0;
    };

    const getAlivePlayers = useCallback(() => {
        return players.filter(player => !isPlayerDead(player));
    }, [players]);

    useEffect(() => {
        const shuffled = shuffleArray(genericQuestions);
        setShuffledQuestions(shuffled);
    }, [shuffleArray]);

    useEffect(() => {
        if (!gameCompleted) {
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
    }, [players, gameCompleted, isGameWon, getAlivePlayers]);

    const restartGame = () => {
        setPlayers([
            { id: 1, name: 'Equipo 1', hp: 10, maxHp: 10, shield: false, x2Active: false, abilities: { shield: false, silence: false, x2: false }, color: OrangeRounded },
            { id: 2, name: 'Equipo 2', hp: 10, maxHp: 10, shield: false, x2Active: false, abilities: { shield: false, silence: false, x2: false }, color: BlueRounded },
            { id: 3, name: 'Equipo 3', hp: 10, maxHp: 10, shield: false, x2Active: false, abilities: { shield: false, silence: false, x2: false }, color: RedRounded },
            { id: 4, name: 'Equipo 4', hp: 10, maxHp: 10, shield: false, x2Active: false, abilities: { shield: false, silence: false, x2: false }, color: GreenRounded }
        ]);
        const shuffled = shuffleArray(genericQuestions);
        setShuffledQuestions(shuffled);
        setCurrentQuestionIndex(0);

        setIsCardFlipped(false);
        setShowAnswer(false);
        setIsAnimatingAnswer(false);
        setGamePhase('select-player');
        setActivePlayerId(null);
        setDamagedPlayers(new Set());
        setShowAbilityIcon(false);
        setAvailableAbility(null);
        setSilencedPlayers(new Map());
        setGamePhaseBeforeAbility(null);
        setPlayerUsingAbility(null);
        setActiveAbilityType(null);
        setPlayersWithNewAbilities(new Set());
        setIsGameWon(false);
        setWinnerPlayer(null);
        setGameCompleted(false);
    };

    const handlePlayerSelect = (playerId) => {
        const player = players.find(p => p.id === playerId);

        if (isPlayerDead(player)) return;

        if (gamePhase === 'select-player') {
            if (silencedPlayers.has(playerId)) return;

            setActivePlayerId(playerId);
            setGamePhase('player-selected');
        } else if (gamePhase === 'select-target') {
            if (playerId === activePlayerId) return;

            handleDamagePlayer(playerId);
        } else if (gamePhase === 'ability-silence') {
            if (playerId === playerUsingAbility) return;

            handleSilencePlayer(playerId);
        }
    };

    const handleCardClick = () => {
        if (gamePhase === 'player-selected' && !isCardFlipped) {
            setIsCardFlipped(true);
            setGamePhase('answer-question');

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

    const handleShowAnswer = () => {
        if (!showAnswer && !isAnimatingAnswer) {
            setIsAnimatingAnswer(true);
            setTimeout(() => {
                setShowAnswer(true);
                setIsAnimatingAnswer(false);
            }, 300);
        } else if (showAnswer) {
            setShowAnswer(false);
        }
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < shuffledQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setCurrentQuestionIndex(0);
        }

        setIsCardFlipped(false);
        setShowAnswer(false);
        setIsAnimatingAnswer(false);
        setGamePhase('select-player');
        setActivePlayerId(null);
        setShowAbilityIcon(false);
        setAvailableAbility(null);

        setTimeout(() => {
            setDamagedPlayers(new Set());
        }, 1000);

        setPlayersWithNewAbilities(new Set());

        setSilencedPlayers(prev => {
            const newMap = new Map();
            for (const [playerId, turnsRemaining] of prev) {
                const newTurns = turnsRemaining - 1;
                if (newTurns > 0) {
                    newMap.set(playerId, newTurns);
                }
            }
            return newMap;
        });
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
            nextQuestion();
        } else {
            setGamePhase('select-target');
        }
    }; const handleWrongAnswer = () => {
        if (activePlayerId && !isGameWon) {
            handleDamagePlayer(activePlayerId);
        } else {
            nextQuestion();
        }
    };

    const handleDamagePlayer = (targetId) => {
        const targetPlayer = players.find(p => p.id === targetId);
        const activePlayer = players.find(p => p.id === activePlayerId);

        if (!targetPlayer || !activePlayer) return;

        let damage = 1;

        if (activePlayer.x2Active) {
            damage = 2;
        }

        if (targetPlayer.shield) {
            setPlayers(prevPlayers =>
                prevPlayers.map(player => {
                    if (player.id === targetId && player.id === activePlayerId) {
                        return { ...player, shield: false, x2Active: false };
                    } else if (player.id === targetId) {
                        return { ...player, shield: false };
                    } else if (player.id === activePlayerId && player.x2Active) {
                        return { ...player, x2Active: false };
                    }
                    return player;
                })
            );
        } else {
            setPlayers(prevPlayers =>
                prevPlayers.map(player => {
                    if (player.id === targetId && player.id === activePlayerId) {
                        return { ...player, hp: Math.max(0, player.hp - damage), x2Active: false };
                    } else if (player.id === targetId) {
                        return { ...player, hp: Math.max(0, player.hp - damage) };
                    } else if (player.id === activePlayerId && player.x2Active) {
                        return { ...player, x2Active: false };
                    }
                    return player;
                })
            );

            setDamagedPlayers(prev => new Set(prev).add(targetId));
        }

        nextQuestion();
    };

    const handleAbilityActivation = (playerId, abilityType) => {
        if (playersWithNewAbilities.has(playerId)) return;

        const player = players.find(p => p.id === playerId);
        if (!player || !player.abilities[abilityType]) return;

        setPlayerUsingAbility(playerId);
        setActiveAbilityType(abilityType);

        if (abilityType === 'shield') {
            setPlayers(prevPlayers =>
                prevPlayers.map(p =>
                    p.id === playerId
                        ? { ...p, shield: true, abilities: { ...p.abilities, shield: false } }
                        : p
                )
            );
            setPlayerUsingAbility(null);
            setActiveAbilityType(null);
        } else if (abilityType === 'silence') {
            setGamePhaseBeforeAbility(gamePhase);
            setGamePhase('ability-silence');
            return;
        } else if (abilityType === 'x2') {
            setPlayers(prevPlayers =>
                prevPlayers.map(p =>
                    p.id === playerId
                        ? { ...p, x2Active: true, abilities: { ...p.abilities, x2: false } }
                        : p
                )
            );
            setPlayerUsingAbility(null);
            setActiveAbilityType(null);
        }
    }; const handleSilencePlayer = (targetId) => {
        setSilencedPlayers(prev => new Map(prev).set(targetId, 2));
        setPlayers(prevPlayers =>
            prevPlayers.map(player =>
                player.id === playerUsingAbility
                    ? { ...player, abilities: { ...player.abilities, silence: false } }
                    : player
            )
        );

        setGamePhase(gamePhaseBeforeAbility);
        setGamePhaseBeforeAbility(null);
        setPlayerUsingAbility(null);
        setActiveAbilityType(null);
    };

    if (shuffledQuestions.length === 0) {
        return (
            <div className="main-game-container">
                <p>Cargando preguntas...</p>
            </div>
        );
    }

    const currentQuestion = shuffledQuestions[currentQuestionIndex];

    return (
        <div className="main-game-container">
            <div className="game-layout">
                <div className="left-side">
                    <div className="card-and-ability-container">
                        <div className="card-section">
                            <Card
                                question={currentQuestion.question}
                                width={getCardDimensions().width}
                                height={getCardDimensions().height}
                                isFlipped={isCardFlipped}
                                onClick={handleCardClick}
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
                            disabled={!isCardFlipped || gamePhase !== 'answer-question'}
                        />
                        <ShowAnswerButton
                            onClick={handleShowAnswer}
                            width={getButtonDimensions().width}
                            height={getButtonDimensions().height}
                            disabled={!isCardFlipped || showAnswer || gamePhase !== 'answer-question'}
                        />
                        <WrongButton
                            onClick={handleWrongAnswer}
                            width={getButtonDimensions().width}
                            height={getButtonDimensions().height}
                            disabled={!isCardFlipped || gamePhase !== 'answer-question'}
                        />
                    </div>
                </div>
                <div className="right-side">
                    <div className="game-instructions">
                        {isGameWon ? (
                            <div className="completion-message">
                                <div style={{
                                    background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                                    padding: '20px',
                                    borderRadius: '15px',
                                    border: '3px solid #FFD700',
                                    boxShadow: '0 0 20px rgba(255, 215, 0, 0.8)',
                                    textAlign: 'center',
                                    marginBottom: '20px'
                                }}>
                                    <h2 style={{
                                        color: '#fff',
                                        margin: '0',
                                        fontSize: '1.5rem',
                                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
                                    }}>
                                        🎉 ¡{winnerPlayer?.name} ha ganado! 🎉
                                    </h2>
                                    <button
                                        onClick={restartGame}
                                        style={{
                                            padding: '10px 20px',
                                            fontSize: '16px',
                                            backgroundColor: '#4CAF50',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            margin: '10px 0 0 0',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
                                        }}
                                    >
                                        🔄 Reiniciar Juego
                                    </button>
                                    <p style={{
                                        color: '#fff',
                                        margin: '10px 0 0 0',
                                        fontSize: '1rem',
                                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
                                    }}>
                                        Puedes continuar jugando con preguntas genéricas
                                    </p>
                                </div>
                            </div>
                        ) : gameCompleted ? (
                            <div className="completion-message">
                                <div style={{
                                    background: 'linear-gradient(45deg, #FF6B6B, #FF4444)',
                                    padding: '20px',
                                    borderRadius: '15px',
                                    border: '3px solid #FF6B6B',
                                    boxShadow: '0 0 20px rgba(255, 107, 107, 0.8)',
                                    textAlign: 'center',
                                    marginBottom: '20px'
                                }}>
                                    <h2 style={{
                                        color: '#fff',
                                        margin: '0',
                                        fontSize: '1.2rem',
                                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
                                    }}>
                                        ¡Todos los jugadores han sido eliminados!
                                    </h2>
                                    <button
                                        onClick={restartGame}
                                        style={{
                                            padding: '12px 24px',
                                            fontSize: '18px',
                                            backgroundColor: '#4CAF50',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            margin: '10px 0 0 0',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
                                        }}
                                    >
                                        🔄 Reiniciar Juego
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {gamePhase === 'select-player' && !isGameWon && (
                                    <p>Selecciona el jugador que va a responder</p>
                                )}
                                {gamePhase === 'select-player' && isGameWon && (
                                    <p>Selecciona al ganador para continuar jugando</p>
                                )}
                                {gamePhase === 'player-selected' && (
                                    <p>{players.find(p => p.id === activePlayerId)?.name} seleccionado. Haz clic en la carta para voltearla</p>
                                )}
                                {gamePhase === 'answer-question' && (
                                    <div>
                                        <p>{isGameWon ? 'Modo libre - ' : 'Turno de '}{players.find(p => p.id === activePlayerId)?.name}</p>
                                        {isCardFlipped && !isGameWon && (
                                            <p style={{ fontSize: '0.9rem', color: '#FFD700' }}>
                                                💫 Puedes usar tus habilidades haciendo clic en los íconos
                                            </p>
                                        )}
                                        {isCardFlipped && isGameWon && (
                                            <p style={{ fontSize: '0.9rem', color: '#87CEEB' }}>
                                                🎮 Modo libre - Sin combate ni habilidades
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
                                        x2Active={player.x2Active}
                                        activeAbilityType={player.id === playerUsingAbility ? activeAbilityType : null}
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
};

export default GenericGameMode;