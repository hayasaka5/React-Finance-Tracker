import React from 'react';
import styles from './SuccessModal.module.scss'; // Create a corresponding stylesheet
import close_icon from '../assets/close_icon.png'; // Path to the close icon

function SuccessModal({ message, onClose }) {
    if (!message) return null; // If there's no message, don't render the modal
    
    return (
        <div className={styles.backdrop} onClick={onClose}>
            <div className={styles.modal}>
                <p>{message}</p>
            </div>
        </div>
    );
}

export default SuccessModal;
