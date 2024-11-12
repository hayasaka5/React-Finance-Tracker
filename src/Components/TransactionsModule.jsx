import React, { useState, useContext, useEffect } from 'react';
import styles from './TransactionsModule.module.scss';
import AddTransactions from './AddTransactions';
import closeIcon from '../assets/close_icon.png';
import { DataContext } from './DataProvider';
import TransactionEdit from './TransactionEdit';
import informationIcon from '../assets/information_icon.png';
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { addTransaction } from './actions.jsx';
import ConfirmationModal from './ConfirmationModal';

function TransactionsModule({ limit, onTransactionAdded }) {
  const { transactions, loading, deleteTransaction, updateTransaction } = useContext(DataContext);
  const [localTransactions, setLocalTransactions] = useState(transactions);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    setLocalTransactions(transactions);
  }, [transactions]);

  const handleOpen = () => setShowAddTransaction(true);
  const handleClose = () => setShowAddTransaction(false);

  const handleDelete = (id) => {
    setTransactionToDelete(id);
    setShowConfirmationModal(true);
  };

  const confirmDelete = async () => {
    if (transactionToDelete) {
      try {
        await deleteTransaction(transactionToDelete);
        toast.success('Transaction successfully deleted!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          transition: Bounce,
        });
      } catch (error) {
        toast.error('Error deleting transaction!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          transition: Bounce,
        });
        console.error('Error deleting transaction:', error);
      } finally {
        setShowConfirmationModal(false);
        setTransactionToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setShowConfirmationModal(false);
    setTransactionToDelete(null);
  };

  const handleEditClick = (transaction) => {
    setSelectedTransaction(transaction);
    setIsEditing(true);
  };

  const closeTransactionEdit = () => {
    setSelectedTransaction(null);
    setIsEditing(false);
  };

  const handleSaveTransaction = async (updatedTransaction) => {
    try {
      await updateTransaction(updatedTransaction);
      toast.success('Transaction successfully updated!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        transition: Bounce,
      });
      setIsEditing(false);
    } catch (error) {
      toast.error('Error updating transaction!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        transition: Bounce,
      });
      console.error('Error updating transaction:', error);
    }
  };

  const handleTransactionAdded = (newTransaction) => {
    dispatch(addTransaction(newTransaction));
    setLocalTransactions([...localTransactions, newTransaction]);
    toast.success('Transaction successfully added!', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      transition: Bounce,
    });
    onTransactionAdded(); // Trigger the parent update
    setShowAddTransaction(false);
  };

  const displayedTransactions = limit ? localTransactions.slice(0, limit) : localTransactions;

  return (
    <div className={styles.TransactionsModule}>
      <div className={styles.top}>
        <div>{limit > 1 ? 'Recent Transactions' : 'All Transactions'}</div>
        <div>
          <a onClick={handleOpen}>+ Add new transaction</a>
          {limit && transactions.length === limit && <a>See more</a>}
        </div>
      </div>
      <div className={styles.bottom}>
        {loading ? (
          <p>Loading...</p>
        ) : displayedTransactions.length === 0 ? (
          <p>No transactions available.</p>
        ) : (
          <table className={styles.transactionTable}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Details</th>
                <th>Category</th>
                <th>Amount</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {displayedTransactions.map((transaction) => (
                <tr key={`${transaction.id}-${transaction.date}`}>
                  <td>{transaction.date ? new Date(transaction.date + "T00:00:00").toLocaleDateString() : 'No date available'}</td>
                  <td>{transaction.transaction}</td>
                  <td>{transaction.category || 'N/A'}</td>
                  <td>{transaction.amount} $</td>
                  <td>
                    <img
                      src={informationIcon}
                      alt="information"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleEditClick(transaction)}
                    />
                  </td>
                  <td>
                    <img
                      src={closeIcon}
                      alt="Delete"
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(transaction.id);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {showAddTransaction && (
        <div className={styles.overlay}>
          <AddTransactions onClose={handleClose} onTransactionAdded={handleTransactionAdded} />
        </div>
      )}
      {isEditing && selectedTransaction && (
        <div className={styles.overlay} onClick={closeTransactionEdit}>
          <TransactionEdit
            transaction={selectedTransaction}
            onClose={closeTransactionEdit}
            onSave={handleSaveTransaction}
          />
        </div>
      )}
      {showConfirmationModal && (
        <div className={styles.overlay}>
          <ConfirmationModal
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        </div>
      )}
    </div>
  );
}

export default TransactionsModule;
