import React from 'react';
import styles from './TransactionDetailsModule.module.scss';
import close_icon from '../assets/close_icon.png';

function TransactionDetailsModule({ transaction, onClose, onEdit }) {
    return (
        <div className={styles.TransactionDetailsModule}>
            <div className={styles.top}>
                <h2>Transaction Detail</h2>
                <span onClick={onClose} style={{ cursor: 'pointer', float: 'right' }}>
                    <img src={close_icon} alt="Close" />
                </span>
            </div>
            <div className={styles.details}>
                <p><strong>Transaction:</strong> {transaction.transaction || 'N/A'}</p>
                <p><strong>Category:</strong> {transaction.category || 'N/A'}</p>
                <p><strong>Date:</strong> {new Date(transaction.date + "T00:00:00").toLocaleDateString() || 'No date available'}</p>
                <p><strong>Amount:</strong> {transaction.amount} $</p>
                <p><strong>Type:</strong> {transaction.type}</p>
                <div className={styles.bottom}>
                <button onClick={onClose}>Close</button>
                <button onClick={onEdit}>Edit</button>
             
</div>

            </div>
        </div>
    );
}

export default TransactionDetailsModule;
