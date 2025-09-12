import React from 'react';
import HealthBar from './HP_bar';
import './PlayerCard.css';

const ShieldIcon = require('../img/Ability_shield.png');
const SilenceIcon = require('../img/Ability_silence.png');
const X2Icon = require('../img/Ability_x2.png');

const PlayerCard = ({
    playerName,
    hp,
    maxHp,
    shield,
    abilities = {},
    background,
    width = 300,
    height = 200,
    onAbilityClick = () => { },
    canUseAbilities = false
}) => {
    return (
        <div
            className="player-card"
            style={{
                backgroundImage: background ? `url(${background})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: `${width}px`,
                height: `${height}px`,
            }}
        >
            <div className="player-name">
                {playerName}
            </div>

            <div className="hp-area">
                <HealthBar hp={hp} maxHp={maxHp} shield={shield} />
            </div>

            <div className="abilities-area">
                <div
                    className={`ability-icon ${abilities.shield && canUseAbilities ? 'clickable' : ''}`}
                    onClick={(e) => {
                        if (abilities.shield && canUseAbilities) {
                            e.stopPropagation();
                            onAbilityClick('shield');
                        }
                    }}
                >
                    <img
                        src={ShieldIcon}
                        alt="Shield"
                        className={abilities.shield ? 'active' : 'inactive'}
                    />
                </div>
                <div
                    className={`ability-icon ${abilities.silence && canUseAbilities ? 'clickable' : ''}`}
                    onClick={(e) => {
                        if (abilities.silence && canUseAbilities) {
                            e.stopPropagation();
                            onAbilityClick('silence');
                        }
                    }}
                >
                    <img
                        src={SilenceIcon}
                        alt="Silence"
                        className={abilities.silence ? 'active' : 'inactive'}
                    />
                </div>
                <div
                    className={`ability-icon ${abilities.x2 && canUseAbilities ? 'clickable' : ''}`}
                    onClick={(e) => {
                        if (abilities.x2 && canUseAbilities) {
                            e.stopPropagation();
                            onAbilityClick('x2');
                        }
                    }}
                >
                    <img
                        src={X2Icon}
                        alt="X2"
                        className={abilities.x2 ? 'active' : 'inactive'}
                    />
                </div>
            </div>
        </div>
    );
};

export default PlayerCard;
