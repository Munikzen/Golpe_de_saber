import ShowAnswerImg from '../img/Btn_show_answer.png';

function ShowAnswerButton({ onClick, width = 250, height = 130, style = {}, disabled = false }) {
    return (
        <button
            onClick={disabled ? undefined : onClick}
            style={{
                background: 'none',
                border: 'none',
                cursor: disabled ? 'not-allowed' : 'pointer',
                padding: 0,
                opacity: disabled ? 0.5 : 1,
                filter: disabled ? 'grayscale(100%)' : 'none',
                transition: 'opacity 0.3s ease, filter 0.3s ease',
                ...style
            }}
            aria-label="Show Answer"
            disabled={disabled}
        >
            <img src={ShowAnswerImg} alt="Show Answer" style={{ width: width, height: height }} />
        </button>
    );
}

export default ShowAnswerButton;
