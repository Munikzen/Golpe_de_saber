import WrongImg from '../img/Btn_wrong.png';

function WrongButton({ onClick, width = 250, height = 130, style = {} }) {
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
            aria-label="Wrong"
        >
            <img src={WrongImg} alt="Wrong" style={{ width: width, height: height }} />
        </button>
    );
}

export default WrongButton;
