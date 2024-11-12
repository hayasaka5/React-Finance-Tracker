import React, { useState, useEffect } from 'react';
import { getAuth, updatePassword, updateEmail, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import styles from './SettingsModule.module.scss';

function SettingsModule() {
    const auth = getAuth();
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatNewPassword, setRepeatNewPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const maxAttempts = 6;
    const cooldownTime = 15 * 60 * 1000; // 15 минут в миллисекундах

    // Загрузка количества попыток и времени последнего сбоя из localStorage
    const [attempts, setAttempts] = useState(() => {
        const savedAttempts = parseInt(localStorage.getItem('attempts'), 10) || 0;
        const lastFailTime = parseInt(localStorage.getItem('lastFailTime'), 10) || 0;
        if (savedAttempts >= maxAttempts && Date.now() - lastFailTime < cooldownTime) {
            return savedAttempts;
        }
        return 0; // сбрасываем если кулдаун прошел
    });

    // Обновляем localStorage при изменении количества попыток
    useEffect(() => {
        localStorage.setItem('attempts', attempts);
    }, [attempts]);

    // Проверка кулдауна (если прошло 15 минут, сбрасываем попытки)
    useEffect(() => {
        if (attempts >= maxAttempts) {
            const lastFailTime = localStorage.getItem('lastFailTime');
            if (Date.now() - lastFailTime >= cooldownTime) {
                setAttempts(0); // Сброс попыток после кулдауна
                localStorage.removeItem('lastFailTime');
            }
        }
    }, [attempts]);

    const isValidEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    // Функция проверки пароля
    const isValidPassword = (password) => {
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordPattern.test(password);
    };

    const handleChangePassword = () => {
        if (attempts >= maxAttempts) {
            setErrorMessage('Too many failed attempts. Please try again later.');
            setSuccessMessage('');
            return;
        }

        if (newPassword !== repeatNewPassword) {
            setErrorMessage('Passwords do not match.');
            setSuccessMessage('');
            return;
        }

        // Проверка на соответствие требованиям к паролю
        if (!isValidPassword(newPassword)) {
            setErrorMessage('Password must be at least 8 characters long, contain one digit and one special character.');
            setSuccessMessage('');
            return;
        }

        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(user.email, currentPassword);

        reauthenticateWithCredential(user, credential)
            .then(() => {
                updatePassword(user, newPassword).then(() => {
                    setSuccessMessage('Password updated successfully.');
                    setErrorMessage('');
                    setAttempts(0); // Сбросить попытки при успехе
                    localStorage.removeItem('lastFailTime');
                }).catch((error) => {
                    if (error.code === 'auth/weak-password') {
                        setErrorMessage('Password is too weak. Please choose a stronger password.');
                    } else {
                        setErrorMessage(`Error updating password: ${error.message}`);
                    }
                    setSuccessMessage('');
                });
            })
            .catch(() => {
                setAttempts((prev) => {
                    const newAttempts = prev + 1;
                    if (newAttempts >= maxAttempts) {
                        setErrorMessage('Too many failed attempts. Please try again later.');
                        localStorage.setItem('lastFailTime', Date.now()); // Сохранить время блокировки
                    } else {
                        setErrorMessage('Incorrect current password.');
                    }
                    setSuccessMessage('');
                    return newAttempts;
                });
            });
    };

    const handleChangeEmail = () => {
        if (attempts >= maxAttempts) {
            setErrorMessage('Too many failed attempts. Please try again later.');
            setSuccessMessage('');
            return;
        }

        if (!isValidEmail(email)) {
            setErrorMessage('Invalid email format.');
            setSuccessMessage('');
            return;
        }

        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(user.email, currentPassword);

        reauthenticateWithCredential(user, credential)
            .then(() => {
                updateEmail(user, email).then(() => {
                    setSuccessMessage('Email updated successfully.');
                    setErrorMessage('');
                    setAttempts(0); // Сбросить попытки при успехе
                    localStorage.removeItem('lastFailTime');
                }).catch((error) => {
                    setErrorMessage(`Error updating email: ${error.message}`);
                    setSuccessMessage('');
                });
            })
            .catch(() => {
                setAttempts((prev) => {
                    const newAttempts = prev + 1;
                    if (newAttempts >= maxAttempts) {
                        setErrorMessage('Too many failed attempts. Please try again later.');
                        localStorage.setItem('lastFailTime', Date.now()); // Сохранить время блокировки
                    } else {
                        setErrorMessage('Incorrect current password.');
                    }
                    setSuccessMessage('');
                    return newAttempts;
                });
            });
    };

    return (
        <div className={styles.SettingsModule}>
            <span className={styles.bigText}>Email Change</span> <br />
            <a>Email</a> <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /> <br />
            <a className={styles.Error}>{errorMessage.includes('Invalid email format') && errorMessage}</a> <br />
            <button onClick={handleChangeEmail}>Change Email</button> <br />
            <span className={styles.bigText}>Password Change</span> <br />
            <a>Previous password</a> <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} /> 
            <a className={styles.Error}>{errorMessage.includes('current password') && errorMessage}</a> <br />
            <a>New password</a> <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /> <br />
            <a>Repeat new password</a> <input type="password" value={repeatNewPassword} onChange={(e) => setRepeatNewPassword(e.target.value)} />  
            <a className={styles.Error}>{errorMessage.includes('Passwords do not match') && errorMessage}</a>
            <br />
            <button onClick={handleChangePassword}>Change Password</button> <br />
            <a className={styles.Error}>
                {!errorMessage.includes('current password') &&
                !errorMessage.includes('Passwords do not match') &&
                !errorMessage.includes('Invalid email format') &&
                !successMessage && errorMessage}
            </a>
            {successMessage && <a className={styles.Success}>{successMessage}</a>}
        </div>
    );
}

export default SettingsModule;
