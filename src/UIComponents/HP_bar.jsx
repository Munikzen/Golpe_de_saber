import React, { useRef } from 'react';
import heartFull from '../img/Full_heart.png';
import heartHalf from '../img/Half_left_heart.png';
import shieldIcon from '../img/Shield.png';
import './HP_bar.css';

function getHeartState(hp, i) {
    if (hp >= (i + 1) * 2) return 'full';
    if (hp === (i * 2) + 1) return 'half';
    return 'empty';
}

function HealthBar({ hp, maxHp, shield }) {
    const prevHp = useRef(hp);
    const prevShield = useRef(!!shield);

    const totalHearts = Math.ceil(maxHp / 2);
    const hearts = [];

    const prevStates = [];
    const currStates = [];
    for (let i = 0; i < totalHearts; i++) {
        prevStates.push(getHeartState(prevHp.current, i));
        currStates.push(getHeartState(hp, i));
    }

    let changedIndex = null;
    for (let i = 0; i < totalHearts; i++) {
        if (prevStates[i] !== currStates[i]) {
            changedIndex = i;
            break;
        }
    }

    for (let i = 0; i < totalHearts; i++) {
        let className = "heart-pop";
        if (i === changedIndex) {
            className += " heart-animate";
        }
        if (currStates[i] === 'full') {
            hearts.push(
                <img
                    key={i}
                    src={heartFull}
                    alt="Full heart"
                    className={className}
                    style={{ width: 27, height: 27, marginRight: 3 }}
                />
            );
        } else if (currStates[i] === 'half') {
            hearts.push(
                <img
                    key={i}
                    src={heartHalf}
                    alt="Half heart"
                    className={className}
                    style={{ width: 27, height: 27, marginRight: 3 }}
                />
            );
        } else {
            hearts.push(null);
        }
    }

    const showShield = !!shield;

    const shieldChanged = showShield && prevShield.current !== !!shield;

    prevHp.current = hp;
    prevShield.current = !!shield;

    return (
        <div className="health-bar" style={{ display: 'flex', alignItems: 'center' }}>
            {hearts}
            {showShield && (
                <img
                    src={shieldIcon}
                    alt="Shield"
                    className={`shield-icon ${shieldChanged ? 'shield-animate' : ''}`}
                />
            )}
        </div>
    );
}

export default HealthBar;