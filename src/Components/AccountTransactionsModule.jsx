import React, { useEffect, useContext } from 'react';
import styles from './AccountTransactionsModule.module.scss';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { DataContext } from './DataProvider'; // Importing the context

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

function AccountTransactionsModule({ shouldUpdate }) {
    const { transactions } = useContext(DataContext); // Using the context to access transactions

    const monthsCount = 6;

    // Function to filter transactions for the last 6 months
    const getFilteredData = () => {
        if (!Array.isArray(transactions)) {
            console.error("Transactions is not an array:", transactions);
            return [];
        }

        const now = new Date();
        const cutoffDate = new Date(now);
        cutoffDate.setMonth(now.getMonth() - monthsCount);
        
        return transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date + "T00:00:00");
            return transactionDate >= cutoffDate;
        });
    };

    const filteredData = getFilteredData();

    // Calculate monthly totals for the line chart
    const monthlyTotals = Array.from({ length: monthsCount }, () => 0);
    const now = new Date();

    filteredData.forEach(transaction => {
        const transactionDate = new Date(transaction.date + "T00:00:00");
        const monthDiff = (now.getFullYear() - transactionDate.getFullYear()) * 12 + now.getMonth() - transactionDate.getMonth();
        if (monthDiff < monthsCount && monthDiff >= 0) {
            monthlyTotals[monthsCount - monthDiff - 1] += (transaction.type === 'expense' ? -transaction.amount : transaction.amount);
        }
    });

    const lineChartData = {
        labels: Array.from({ length: monthsCount }, (_, i) => {
            const month = new Date(now.getFullYear(), now.getMonth() - (monthsCount - i - 1), 1);
            return month.toLocaleString('default', { month: 'short' });
        }),
        datasets: [{
            label: 'Net Balance',
            data: monthlyTotals,
            borderColor: '#F4AC45',
            backgroundColor: 'rgba(244, 172, 69, 0.1)',
            borderWidth: 2,
            tension: 0.3,
        }],
    };

    // Calculate total balance
    const totalBalance = filteredData.reduce((acc, transaction) => acc + (transaction.type === 'expense' ? -transaction.amount : transaction.amount), 0);
    const formattedBalance = totalBalance > 0 ? `+$${Math.round(totalBalance)}` : totalBalance;
    const balanceClass = totalBalance > 0 ? styles.green : totalBalance < 0 ? styles.red : styles.black;

    // Calculate income and expense categories
    const incomeCategories = {};
    const expenseCategories = {};

    filteredData.forEach(transaction => {
        const category = transaction.category || 'Unknown';
        if (transaction.type === 'income') {
            incomeCategories[category] = (incomeCategories[category] || 0) + transaction.amount;
        } else {
            expenseCategories[category] = (expenseCategories[category] || 0) + transaction.amount;
        }
    });

    const incomeLabels = Object.keys(incomeCategories);
    const incomeValues = incomeLabels.map(label => incomeCategories[label]);
    const expenseLabels = Object.keys(expenseCategories);
    const expenseValues = expenseLabels.map(label => expenseCategories[label]);

    const incomeChartData = {
        labels: incomeLabels,
        datasets: [{
            data: incomeValues,
            backgroundColor: incomeLabels.map((_, index) => ['#00aaff', '#ff4c4c', '#4caf50', '#ffeb3b'][index % 4]),
        }],
    };

    const expenseChartData = {
        labels: expenseLabels,
        datasets: [{
            data: expenseValues,
            backgroundColor: expenseLabels.map((_, index) => ['#ff4c4c', '#ff9800', '#2196f3', '#4caf50'][index % 4]),
        }],
    };

    useEffect(() => {
        if (shouldUpdate) {
            console.log('Account transactions module updated!');
        }
    }, [shouldUpdate]);

    return (
        <div className={styles.AccountTransactionsModuleWrap}>
            <div className={styles.AccountTransactionsModule}>
                <div className={styles.top}>
                    <div className={styles.left}>
                        <h3>Account Transactions</h3>
                        <a>Net worth</a>
                    </div>
                    <div className={styles.right}></div>
                </div>
                <div className={`${styles.status} ${balanceClass}`}>
                    <p>{formattedBalance} $</p>
                </div>
                <div className={styles.bottom}>
                    <h4>Last {monthsCount} months</h4>
                    <Line data={lineChartData} options={{
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: function (value) {
                                        return `$${value}`;
                                    }
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                display: false,
                            }
                        }
                    }} />
                </div>
            </div>
            <div className={styles.rightMenuWrap}>
                <div className={styles.topChart}>
                    <span>Spending by category</span>
                    <div className={styles.chartWrap}>
                        {expenseValues.length > 0 ? (
                            <Doughnut data={expenseChartData} options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'right',
                                        labels: {
                                            font: {
                                                size: 14
                                            },
                                            boxWidth: 10,
                                        },
                                    },
                                },
                            }} />
                        ) : (
                            <p>No expense transactions available</p>
                        )}
                    </div>
                </div>
                <div className={styles.bottomChart}>
                    <span>Income by category</span>
                    <div className={styles.chartWrap}>
                        {incomeValues.length > 0 ? (
                            <Doughnut data={incomeChartData} options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'right',
                                        labels: {
                                            font: {
                                                size: 14
                                            },
                                            boxWidth: 10,
                                        },
                                    },
                                },
                            }} />
                        ) : (
                            <p>No income transactions available</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AccountTransactionsModule;
