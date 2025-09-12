import ShowAnswerImg from '../img/Btn_show_answer.png';

function ShowAnswerButton({ onClick, width = 250, height = 130, style = {} }) {
    return (
        <button
            onClick={onClick}
            style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                ...style
            }}
            aria-label="Show Answer"
        >
            <img src={ShowAnswerImg} alt="Show Answer" style={{ width: width, height: height }} />
        </button>
    );
}

export default ShowAnswerButton;
