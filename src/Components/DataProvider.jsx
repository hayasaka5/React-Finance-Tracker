import React, { createContext, useEffect, useState, useContext } from 'react';
import {
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    doc,
    deleteDoc,
    updateDoc,
    addDoc,
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Create a context for data management
export const DataContext = createContext();

// DataProvider component to manage transactions and user state
export const DataProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const db = getFirestore();
    const auth = getAuth();

    // Function to fetch transactions from Firestore
    const fetchTransactions = async (currentUser) => {
        setLoading(true);
        if (currentUser) {
            try {
                const q = query(
                    collection(db, 'transactions'),
                    where('uid', '==', currentUser.uid)
                );

                const querySnapshot = await getDocs(q);
                const transactionsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                // Sort transactions by date (most recent first)
                transactionsData.sort((a, b) => {
                    const dateA = new Date(a.date + "T00:00:00");
                    const dateB = new Date(b.date + "T00:00:00");
                    return dateB - dateA;
                });

                setTransactions(transactionsData);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        } else {
            setTransactions([]);
        }
        setLoading(false);
    };

    // Listen for authentication state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                fetchTransactions(currentUser);
            }
        });

        return () => unsubscribe();
    }, [auth]);

    // Function to add a new transaction
    const addTransaction = async (newTransaction) => {
        if (!user) return; // Ensure the user is authenticated
        try {
            const newTransactionRef = await addDoc(collection(db, 'transactions'), {
                ...newTransaction,
                uid: user.uid, // Ensure uid is included
            });
            const transactionWithId = { ...newTransaction, id: newTransactionRef.id };

            // Update local state immediately
            setTransactions(prevTransactions => [transactionWithId, ...prevTransactions]);
        } catch (error) {
            console.error('Error adding transaction:', error);
        }
    };

    // Function to delete a transaction
    const deleteTransaction = async (id) => {
        await deleteDoc(doc(db, 'transactions', id));
        setTransactions(prevTransactions => prevTransactions.filter(transaction => transaction.id !== id));
    };

    // Function to update a transaction
    const updateTransaction = async (id, updatedTransaction) => {
        const transactionRef = doc(db, 'transactions', id);
        await updateDoc(transactionRef, updatedTransaction);

        setTransactions(prevTransactions =>
            prevTransactions.map(transaction =>
                transaction.id === id ? { ...transaction, ...updatedTransaction } : transaction
            )
        );
    };

    // Provide context values
    return (
        <DataContext.Provider value={{ transactions, loading, addTransaction, deleteTransaction, updateTransaction, user }}>
            {children}
        </DataContext.Provider>
    );
};

// Custom hook to use the DataContext
export const useDataContext = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useDataContext must be used within a DataProvider');
    }
    return context;
};
