import CorrectButton from './CorrectButton';
import WrongButton from './WrongButton';
import ShowAnswerButton from './ShowAnswerButton';

function CardButtons({ onRight, onWrong, onShowAnswer, buttonSize = 120, containerStyle = {} }) {
    return (
        <div
            className="card-buttons"
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                alignItems: 'center',
                ...containerStyle
            }}
        >
            <CorrectButton onClick={onRight} size={buttonSize} />
            <WrongButton onClick={onWrong} size={buttonSize} />
            <ShowAnswerButton onClick={onShowAnswer} size={buttonSize} />
        </div>
    );
}

export default CardButtons;
