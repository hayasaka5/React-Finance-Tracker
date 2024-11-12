// chartUtils.js
export const calculateChartData = (transactions) => {
    const monthsToDisplay = 7;
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
            if (transaction.type === 'expense') {
                monthlyTotals[monthsToDisplay - monthDiff - 1] -= transaction.amount;
                const category = transaction.category || 'Unknown';
                expenseCategories[category] = (expenseCategories[category] || 0) + transaction.amount;
            } else if (transaction.type === 'income') {
                monthlyTotals[monthsToDisplay - monthDiff - 1] += transaction.amount;
                const category = transaction.category || 'Unknown';
                incomeCategories[category] = (incomeCategories[category] || 0) + transaction.amount;
            }
        }
    });

    return {
        monthlyTotals,
        incomeCategories,
        expenseCategories,
    };
};
