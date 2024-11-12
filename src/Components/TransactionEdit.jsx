import React, { useState, useContext, useEffect } from 'react';
import { DataContext } from './DataProvider';
import styles from './TransactionEdit.module.scss';
import close_icon from '../assets/close_icon.png';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { updateTransactions } from './actions'; // Импортируйте правильный путь к вашему файлу действий

const expenseCategories = [
  "Rent", "Mortgage", "Utilities", "Groceries", "Transportation", "Entertainment",
  "Dining out", "Healthcare", "Insurance", "Education", "Clothing", "Subscriptions",
  "Gifts", "Repairs", "Travel"
];

const incomeCategories = [
  "Salary", "Freelance", "Investments", "Refunds", "Bonus", "Commission",
  "Rental Income", "Interest Income", "Dividends"
];

function TransactionEdit({ transaction, onClose }) {
    const dispatch = useDispatch(); // Инициализируем dispatch внутри компонента
    const { updateTransactions: contextUpdateTransactions } = useContext(DataContext);  
    const [isEditing, setIsEditing] = useState(false);
    const [editTransaction, setEditTransaction] = useState(transaction);

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

    const handleEditClick = (e) => {
        e.stopPropagation();
        setIsEditing(true);
    };
    
    const handleSaveClick = async (e) => {
        e.preventDefault();
        try {
            if (!editTransaction.transaction || !editTransaction.category || !editTransaction.amount || !editTransaction.date) {
                throw new Error('Please fill in all required fields.');
            }

            // Обновление транзакции через dispatch
            await dispatch(updateTransactions(editTransaction.id, editTransaction));
            
            setIsEditing(false);
            toast.success('Transaction successfully updated!', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (error) {
            toast.error(error.message || 'An error occurred while updating the transaction.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };
    
    const handleCloseClick = (e) => {
        e.stopPropagation();
        if (onClose) {
            onClose();
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditTransaction({
            ...editTransaction,
            [name]: value
        });
    };

    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    useEffect(() => {
        if (transaction) {
            setEditTransaction(transaction);
        }
    }, [transaction]);

    return (
        <div className={styles.TransactionDetailsModule} onClick={handleModalClick}>
            <div className={styles.top}>
                {isEditing ? 'Edit Transaction' : 'Transaction Details'}
                <span onClick={handleCloseClick} style={{ cursor: 'pointer', float: 'right' }}>
                    <img src={close_icon} alt="Close" />
                </span>
            </div>
            <div className={styles.details}>
                {!isEditing ? (
                    <>
                        <p><strong>Transaction:</strong> {transaction.transaction || 'N/A'}</p>
                        <p><strong>Category:</strong> {transaction.category || 'N/A'}</p>
                        <p><strong>Date:</strong> {new Date(transaction.date + "T00:00:00").toLocaleDateString() || 'No date available'}</p>
                        <p><strong>Amount:</strong> {transaction.amount} $</p>
                        <p><strong>Type:</strong> {transaction.type}</p>
                    </>
                ) : (
                    <form onSubmit={handleSaveClick}>
                        <label htmlFor="transaction">Transaction</label>
                        <input
                            type="text"
                            name="transaction"
                            value={editTransaction.transaction}
                            onChange={handleChange}
                            required
                        />

                        <label htmlFor="category">Category</label>
                        <select
                            name="category"
                            value={editTransaction.category || ''}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a category</option>
                            <optgroup label="Income">
                                {incomeCategories.map(cat => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </optgroup>
                            <optgroup label="Expenses">
                                {expenseCategories.map(cat => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </optgroup>
                        </select>

                        <label htmlFor="date">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={editTransaction.date}
                            onChange={handleChange}
                            required
                        />

                        <label htmlFor="amount">Amount</label>
                        <input
                            type="number"
                            name="amount"
                            value={editTransaction.amount}
                            onChange={handleChange}
                            required
                        />

                        <div className={styles.bottom}>
                            <button type="button" onClick={handleCloseClick} className={styles.closeButton}>
                                Close
                            </button>
                            <button type="submit" className={styles.editButton}>
                                Save
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {!isEditing && (
                <div className={styles.bottom}>
                    <button type="button" onClick={handleCloseClick} className={styles.closeButton}>
                        Close
                    </button>
                    <button type="button" onClick={handleEditClick} className={styles.editButton}>
                        Edit
                    </button>
                </div>
            )}
        </div>
    );
}

export default TransactionEdit;
