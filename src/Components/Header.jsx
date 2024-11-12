import React, { useContext } from "react";
import styles from "./Header.module.scss";
import { DataContext } from './DataProvider'; // Импорт контекста

function Header({ section_name }) {
    const { user } = useContext(DataContext); // Получаем пользователя из контекста

    // console.log(user);

    return (
        <div className={styles.Header}>
            <a>{section_name}</a>

            {user ? (
                <div>{user.email}</div> // Если пользователь существует, показываем email
            ) : (
                <div>User isn't logged in</div> // Если нет, показываем сообщение
            )}
        </div>
    );
}

export default Header;
