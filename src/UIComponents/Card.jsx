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
            style={{
                width: width ? `${width}px` : '660px',
                height: height ? `${height}px` : '870px',
            }}
        >
            <div
                className={`card-flip-inner${isFlipped ? ' flipped' : ''}`}
                style={{
                    width: width ? `${width}px` : '660px',
                    height: height ? `${height}px` : '870px',
                }}
            >
                <div
                    className="card-face card-back"
                    style={{
                        backgroundImage: `url(${cardBack})`,
                        width: width ? `${width}px` : '660px',
                        height: height ? `${height}px` : '870px',
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
                        width: width ? `${width}px` : '660px',
                        height: height ? `${height}px` : '870px',
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