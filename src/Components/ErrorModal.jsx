import React from 'react';
import styles from './ErrorModal.module.scss';
import close_icon from '../assets/close_icon.png'
function ErrorModal({ message, onClose }) {
    if (!message) return null; // Если нет сообщения, не рендерим модалку
    
    return (
        <div className={styles.backdrop} onClick={onClose}>
            <div className={styles.modal}>
                {/* <h2>Error</h2> */}
                <p>{message}</p>
                {/* <button onClick={onClose}><img src={close_icon} alt="close_icon" /></button> */}
            </div>
        </div>
    );
}

export default ErrorModal;
