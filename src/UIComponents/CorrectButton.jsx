import CorrectImg from '../img/Btn_correct.png';

function CorrectButton({ onClick, width = 250, height = 130, style = {} }) {
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
            aria-label="Correct"
        >
            <img src={CorrectImg} alt="Correct" style={{ width: width, height: height }} />
        </button>
    );
}

export default CorrectButton;
