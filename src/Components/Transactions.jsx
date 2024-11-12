import styles from './Transactions.module.scss';
import React from 'react';
import LeftMenu from './LeftMenu';
import Header from './Header';
import TransactionsModule from './TransactionsModule';
function Transactions(){
    return(
        <div className={styles.Transactions}>
            <Header section_name='Transactions'/>
            <TransactionsModule/>
        </div>
    )
}
export default Transactions;