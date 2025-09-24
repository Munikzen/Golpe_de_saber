import CorrectImg from '../img/Btn_correct.png';

function CorrectButton({ onClick, width = 250, height = 130, style = {}, disabled = false }) {
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
            aria-label="Correct"
            disabled={disabled}
        >
            <img src={CorrectImg} alt="Correct" style={{ width: width, height: height }} />
        </button>
    );
}

export default CorrectButton;
