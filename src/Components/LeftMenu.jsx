import React, { useState, useEffect } from 'react';
import styles from './LeftMenu.module.scss';
import accounts_icon from './accounts_icon.png';
import transactions_icon from './transactions_icon.png';
import dashboard_icon from './dashboard_icon.png';
import settings_icon from './settings_icon.png';
import { Link, useLocation } from 'react-router-dom';

function LeftMenu() {
    const location = useLocation(); // Get the current location
    const [activeItem, setActiveItem] = useState(location.pathname); // Set the active item based on the current path

    // Update activeItem when the location changes
    useEffect(() => {
        setActiveItem(location.state?.activeElement || location.pathname);
    }, [location]);

    const handleItemClick = (path) => {
        setActiveItem(path); // Set the active item when clicked
    };

    return (
        <div className={styles.LeftMenu}>
            <div className={styles.logo}>MoneySaver</div>
            <div className={styles.logoMobile}>MS</div>

            <Link to="/Layout/dashboard" className={styles.link} onClick={() => handleItemClick('/Layout/dashboard')}>
                <div className={`${styles.LeftMenuItem} ${activeItem === '/Layout/dashboard' ? styles.leftMenuItemActive : ''}`}>
                    <img src={dashboard_icon} alt="Dashboard" />
                    <span>Dashboard</span>
                </div>
            </Link>

            <Link to="/Layout/transactions" className={styles.link} onClick={() => handleItemClick('/Layout/transactions')}>
                <div className={`${styles.LeftMenuItem} ${activeItem === '/Layout/transactions' ? styles.leftMenuItemActive : ''}`}>
                    <img src={transactions_icon} alt="Transactions" />
                    <span>Transactions</span>
                </div>
            </Link>

            <Link to="/Layout/settings" className={styles.link} onClick={() => handleItemClick('/Layout/settings')}>
                <div className={`${styles.LeftMenuItem} ${activeItem === '/Layout/settings' ? styles.leftMenuItemActive : ''}`}>
                    <img src={settings_icon} alt="Settings" />
                    <span>Settings</span>
                </div>
            </Link>
        </div>
    );
}

export default LeftMenu;
