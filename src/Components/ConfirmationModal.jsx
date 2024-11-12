import React from 'react';
import closeIcon from '../assets/close_icon.png';
import styles from './ConfirmationModal.module.scss';
import { useEffect } from 'react';
function ConfirmationModal({ onConfirm, onCancel }) {
    useEffect(() => {
        // Prevent scrolling when modal is open
        const preventScroll = (e) => {
          e.preventDefault();
          e.stopPropagation();
        };
    
        document.body.style.overflow = 'hidden';
        document.addEventListener('wheel', preventScroll, { passive: false });
        document.addEventListener('scroll', preventScroll, { passive: false });
    
        return () => {
          document.body.style.overflow = '';
          document.removeEventListener('wheel', preventScroll);
          document.removeEventListener('scroll', preventScroll);
        };
      }, []);
    return (
        
        <div className={styles.ConfirmationModal}>
            <div className={styles.top}>
            <p>Delete Confirmation</p>
            <img src={closeIcon} alt="close_icon" style={{ cursor: 'pointer' }} onClick={onCancel} />
            </div>
            Are you sure you want to delete this record?
            <div className={styles.bottom}>
                <button onClick={onCancel} className={styles.buttonCancel}>No</button>
                <button onClick={onConfirm} className={styles.buttonConfirm}>Yes</button>

            </div>
        </div>
    );
}

export default ConfirmationModal;
