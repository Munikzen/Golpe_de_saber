import React, { useState } from 'react';
import AppLogo from '../img/App_logo.png';
import LogoUAM from '../img/logoUAM.png';
import './Credits.css';

const Credits = () => {
    const [showCredits, setShowCredits] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setShowCredits(false);
            setIsClosing(false);
        }, 300);
    };

    return (
        <div className="credits-container">
            <button
                onClick={() => setShowCredits(!showCredits)}
                className="credits-logo"
                aria-label="Créditos del juego"
            >
                <img
                    src={AppLogo}
                    alt="Golpe de Saber Logo"
                />
            </button>

            {showCredits && (
                <div className={`credits-bubble ${isClosing ? 'closing' : ''}`}>
                    <div style={{ marginBottom: '15px' }}>
                        <h3 className="credits-title">
                            🏆 Créditos
                        </h3>
                    </div>

                    <div className="credits-section">
                        <strong className="credits-section-title"> Responsables del sitio:</strong>
                        <p className="credits-text">
                            Dra. María del Carmen Gómez Fuentes<br />
                            Dr. Jorge Cervantes Ojeda
                        </p>
                    </div>

                    <div className="credits-section">
                        <strong className="credits-section-title">👨‍💻 Desarrolladores:</strong>
                        <p className="credits-text">
                            Brandon Chávez Salaverría<br />
                            Daniel Arenas Reyes
                        </p>
                    </div>

                    <div className="credits-section">
                        <strong className="credits-section-title">🏫 Institución:</strong>
                        <p className="credits-text">
                            Universidad Autónoma Metropolitana<br />
                            Unidad Cuajimalpa
                        </p>
                        <div style={{ textAlign: 'center', marginTop: '8px' }}>
                            <img
                                src={LogoUAM}
                                alt="Logo UAM"
                                style={{
                                    height: '40px',
                                    width: 'auto',
                                    filter: 'brightness(1.2)'
                                }}
                            />
                        </div>
                    </div>

                    <div className="credits-section">
                        <strong className="credits-section-title">🎯 Propósito:</strong>
                        <p className="credits-text">
                            Juego educativo interactivo para<br />
                            el aprendizaje colaborativo
                        </p>
                    </div>

                    <div className="credits-section" style={{ marginBottom: '0' }}>
                        <strong className="credits-section-title">© Copyright:</strong>
                        <p className="credits-text">
                            Copyright © Universidad Autónoma Metropolitana 2025
                        </p>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        className="credits-close-button"
                        aria-label="Cerrar créditos"
                    >
                        ✕
                    </button>
                </div>
            )}
        </div>
    );
};

// Export both the component and the click handler
export { Credits as default, Credits };
export const useCreditsHandler = () => {
    const [showCredits, setShowCredits] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setShowCredits(false);
            setIsClosing(false);
        }, 300);
    };

    const handleLogoClick = () => {
        setShowCredits(!showCredits);
    };

    return {
        showCredits,
        isClosing,
        handleLogoClick,
        handleClose,
        CreditsDisplay: () => showCredits && (
            <div className={`credits-bubble ${isClosing ? 'closing' : ''}`}>
                <div style={{ marginBottom: '15px' }}>
                    <h3 className="credits-title">
                        🏆 Créditos
                    </h3>
                </div>

                <div className="credits-section">
                    <strong className="credits-section-title">👨‍💻 Desarrollo:</strong>
                    <p className="credits-text">
                        Equipo de desarrollo UAM<br />
                        Golpe de Saber v1.0
                    </p>
                </div>

                <div className="credits-section">
                    <strong className="credits-section-title">🎨 Diseño:</strong>
                    <p className="credits-text">
                        Interfaz de usuario y experiencia<br />
                        Diseño de componentes visuales
                    </p>
                </div>

                <div className="credits-section">
                    <strong className="credits-section-title">🏫 Institución:</strong>
                    <p className="credits-text">
                        Universidad Autónoma Metropolitana<br />
                        Unidad Azcapotzalco
                    </p>
                </div>

                <div className="credits-section">
                    <strong className="credits-section-title">📅 Año:</strong>
                    <p className="credits-text">
                        2024
                    </p>
                </div>

                <div className="credits-section" style={{ marginBottom: '0' }}>
                    <strong className="credits-section-title">🎯 Propósito:</strong>
                    <p className="credits-text">
                        Juego educativo interactivo para<br />
                        el aprendizaje colaborativo
                    </p>
                </div>

                <button
                    onClick={handleClose}
                    className="credits-close-button"
                    aria-label="Cerrar créditos"
                >
                    ✕
                </button>
            </div>
        )
    };
};