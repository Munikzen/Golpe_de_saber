import React, { useState } from 'react';
import InstructionsIcon from '../img/Instructions_Icon.png';
import './ManualButton.css';

const ManualButton = () => {
    const [showManual, setShowManual] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setShowManual(false);
            setIsClosing(false);
        }, 300); // Match animation duration
    };

    return (
        <div className="manual-button">
            <button
                onClick={() => setShowManual(!showManual)}
                className="manual-icon-button"
                aria-label="Instrucciones del juego"
            >
                <img
                    src={InstructionsIcon}
                    alt="Instrucciones"
                    className="manual-icon"
                />
            </button>

            {/* Manual Bubble */}
            {showManual && (
                <div className={`manual-bubble ${isClosing ? 'closing' : ''}`}>
                    <div style={{ marginBottom: '15px' }}>
                        <h3 className="manual-title">
                            🎯 Cómo Jugar
                        </h3>
                    </div>

                    <div className="manual-section">
                        <strong className="manual-section-title">🎮 Turnos:</strong>
                        <p className="manual-text">
                            1. Presiona el botón antes que los demás.<br />
                            2. Selecciona el equipo que presionó primero.<br />
                            3. Haz clic en la carta para voltearla, aquí puedes activar una habilidad<br />
                            4. Elige un resultado dependiendo la respuesta.
                        </p>
                    </div>

                    <div className="manual-section">
                        <strong className="manual-section-title">⚔️ Combate:</strong>
                        <p className="manual-text">
                            • Respuesta correcta: Ataca a otro equipo<br />
                            • Respuesta incorrecta: Pierdes una vida<br />
                            • Aleatoriamente pueden aparecer habilidades especiales que se otorgan si contestas correctamente
                        </p>
                    </div>

                    <div className="manual-section" style={{ marginBottom: '0' }}>
                        <strong className="manual-section-title">✨ Habilidades:</strong>
                        <p className="manual-text">
                            🛡️ Escudo: Te protege del siguiente daño recibido<br />
                            🔇 Silencio: El equipo elegido no puede jugar el siguiente turno<br />
                            ⚡ x2: Tu próximo ataque hace doble daño
                        </p>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        className="manual-close-button"
                        aria-label="Cerrar instrucciones"
                    >
                        ✕
                    </button>
                </div>
            )}
        </div>
    );
};

export default ManualButton;