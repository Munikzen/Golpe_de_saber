import cardFront from '../img/Card_front.png';
import cardBack from '../img/Card_back.png';
import './Card.css';

function Card({
    isFlipped,
    onClick,
    width,
    height,
    question,
    children,
}) {
    return (
        <div
            className="card-3d-wrapper"
            onClick={onClick}
        >
            <div className={`card-flip-inner${isFlipped ? ' flipped' : ''}`}>
                <div
                    className="card-face card-back"
                    style={{
                        backgroundImage: `url(${cardBack})`,
                    }}
                />
                <div
                    className="card-face card-front"
                    style={{
                        backgroundImage: `url(${cardFront})`,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        boxSizing: 'border-box',
                        transform: 'rotateY(180deg)',
                    }}
                >
                    <div className="card-content">
                        <div className="card-question">
                            {question}
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Card;