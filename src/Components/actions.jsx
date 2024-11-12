// Action types
export const ADD_TRANSACTION = 'ADD_TRANSACTION';
export const UPDATE_TRANSACTIONS = 'UPDATE_TRANSACTIONS';
export const UPDATE_CHART = 'UPDATE_CHART';

// Action for adding a transaction
export const addTransaction = (transaction, addTransactionFromContext) => {
    return (dispatch) => {
      console.log("State before adding transaction:", /* your state here */);
  
      // Add the transaction to the context
      if (addTransactionFromContext) {
        addTransactionFromContext(transaction);
      } else {
        console.error('addTransactionFromContext is not a function');
      }
  
      // Dispatch the action to the Redux store
      dispatch({ type: ADD_TRANSACTION, payload: transaction });
    };
  };
// Action for updating transactions
export const updateTransactions = (transactions) => ({
    type: UPDATE_TRANSACTIONS,
    payload: transactions,
});

// Action for updating the chart
export const updateChart = () => {
    return (dispatch, getState) => {
        try {
            const transactionsState = getState().transactions;

            if (Array.isArray(transactionsState)) {
                const chartData = calculateChartData(transactionsState);
                dispatch({ type: UPDATE_CHART, payload: chartData });
            } else {
                console.error('Transactions state is not available or is not an array');
            }
        } catch (error) {
            console.error('Error while updating chart:', error);
        }
    };
};

// Function to calculate chart data
const calculateChartData = (transactions) => {
    const monthsToDisplay = 7; // Last 6 months and current month
    const now = new Date();
    const cutoffDate = new Date(now);
    cutoffDate.setMonth(now.getMonth() - (monthsToDisplay - 1));

    const filteredTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date + "T00:00:00");
        return !isNaN(transactionDate) && transactionDate >= cutoffDate;
    });

    const monthlyTotals = Array.from({ length: monthsToDisplay }, () => 0);
    const incomeCategories = {};
    const expenseCategories = {};

    filteredTransactions.forEach(transaction => {
        const transactionDate = new Date(transaction.date + "T00:00:00");
        if (isNaN(transactionDate)) return;

        const monthDiff = (now.getFullYear() - transactionDate.getFullYear()) * 12 + now.getMonth() - transactionDate.getMonth();

        if (monthDiff < monthsToDisplay && monthDiff >= 0) {
            const amount = transaction.amount;
            const category = transaction.category || 'Unknown';

            if (transaction.type === 'expense') {
                monthlyTotals[monthsToDisplay - monthDiff - 1] -= amount;
                expenseCategories[category] = (expenseCategories[category] || 0) + amount;
            } else if (transaction.type === 'income') {
                monthlyTotals[monthsToDisplay - monthDiff - 1] += amount;
                incomeCategories[category] = (incomeCategories[category] || 0) + amount;
            }
        }
    });

    return {
        monthlyTotals,
        incomeCategories,
        expenseCategories,
    };
};
