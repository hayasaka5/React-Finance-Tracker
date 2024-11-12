import React, { useState, useEffect, useRef, useContext } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import styles from './AddTransactions.module.scss';
import close_icon from '../assets/close_icon.png';
import { DataContext } from './DataProvider'; // Import your DataContext

const expenseCategories = [
    "Rent", "Mortgage", "Utilities", "Groceries", "Transportation", "Entertainment",
    "Dining out", "Healthcare", "Insurance", "Education", "Clothing", "Subscriptions",
    "Gifts", "Repairs", "Travel"
];

function AddTransactions({ onClose }) {
    const [transaction, setTransaction] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [amount, setAmount] = useState('');
    const auth = getAuth();
    const db = getFirestore();
    const modalRef = useRef(null);
    const { addTransaction } = useContext(DataContext); // Get the function from context

    // Listen for authentication state changes
    const [user, setUser] = useState(null);
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, [auth]);

    // Prevent scrolling when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            console.error('User is not logged in.');
            return;
        }

        if (!category) {
            console.error('Category is required.');
            return;
        }

        const type = expenseCategories.includes(category) ? 'expense' : 'income';

        const newTransaction = {
            uid: user.uid,
            email: user.email,
            transaction,
            category,
            type,
            date,
            amount: parseFloat(amount),
            createdAt: new Date(),
        };

        try {
            // Use the context function to add the transaction
            await addTransaction(newTransaction);

            // Clear the form fields
            resetForm();

            // Close the modal
            onClose();

        } catch (error) {
            console.error('Error adding transaction: ', error);
        }
    };

    // Reset form fields
    const resetForm = () => {
        setTransaction('');
        setCategory('');
        setDate('');
        setAmount('');
    };

    // Handle click outside to close modal
    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={styles.AddTransactions}>
            <div className={styles.overlay}>
                <div className={styles.modal} ref={modalRef}>
                    <div className={styles.top}>
                        Add Transaction
                        <img src={close_icon} alt="Close" onClick={onClose} className={styles.closeIcon} />
                    </div>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <label htmlFor="transaction">Transaction</label>
                        <input
                            type="text"
                            name="transaction"
                            value={transaction}
                            maxLength={25}
                            onChange={(e) => setTransaction(e.target.value)}
                        />

                        <label htmlFor="category">Category</label>
                        <select
                            name="category"
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            <option value="">Select a category</option>
                            <optgroup label="Income">
                                <option value="salary">Salary</option>
                                <option value="freelance">Freelance</option>
                                <option value="investments">Investments</option>
                                <option value="refunds">Refunds</option>
                                <option value="bonus">Bonus</option>
                                <option value="commission">Commission</option>
                                <option value="rental income">Rental Income</option>
                                <option value="interest income">Interest Income</option>
                                <option value="dividends">Dividends</option>
                            </optgroup>
                            <optgroup label="Expenses">
                                {expenseCategories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </optgroup>
                        </select>

                        <label htmlFor="date">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />

                        <label htmlFor="amount">Amount</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />

                        <div className={styles.buttons}>
                            <button type="button" onClick={onClose} className={styles.close}>Close</button>
                            <button type="submit" className={styles.add}>Add</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddTransactions;
