import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.scss';
import Header from './Header.jsx';
import AccountTransactionsModule from './AccountTransactionsModule.jsx';
import TransactionsModule from './TransactionsModule.jsx';

function Dashboard() {
    const [shouldUpdate, setShouldUpdate] = useState(false);

    const handleTransactionAdded = () => {
        setShouldUpdate((prev) => !prev);
    };

    return (
        <div className={styles.Dashboard}>
            <Header section_name='Dashboard' />
            <AccountTransactionsModule shouldUpdate={shouldUpdate} />
            <TransactionsModule limit={10} onTransactionAdded={handleTransactionAdded} shouldUpdate={shouldUpdate} />
        </div>
    );
}

export default Dashboard;
