import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, createUserWithEmailAndPassword } from './firebaseConfig';
import styles from './SignUp.module.scss';
import LeftLogo from '../Components/LeftLogo';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // состояние для повторного пароля
    const navigate = useNavigate();

    const handleSignUp = async (event) => {
        event.preventDefault();

        // Проверка на совпадение паролей
        if (password !== confirmPassword) {
            toast.error('Passwords do not match.', {
                toastId: 'passwordMismatch', // Уникальный идентификатор для этого уведомления
            });
            return; // Прерываем выполнение, если пароли не совпадают
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate('/Layout/dashboard', { state: { activeElement: '/Layout/dashboard' } });
        } catch (error) {
            // Обработка ошибок Firebase
            switch (error.code) {
                case 'auth/email-already-in-use':
                    toast.error('Email address is already in use.', { toastId: 'emailInUse' });
                    break;
                case 'auth/invalid-email':
                    toast.error('Invalid email address.', { toastId: 'invalidEmail' });
                    break;
                case 'auth/weak-password':
                    toast.error('The password is too weak.', { toastId: 'weakPassword' });
                    break;
                default:
                    toast.error('Failed to register. Please try again.', { toastId: 'registrationFailed' });
                    break;
            }
        }
    };

    return (
        <div className={styles.signIn}>
            <LeftLogo />
            <div className={styles.right}>
                <p>Sign Up</p>
                <form onSubmit={handleSignUp}>
                    <input
                        type="email"
                        name="Email"
                        id="Email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        name="Password"
                        id="Password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        name="ConfirmPassword"
                        id="ConfirmPassword"
                        placeholder="Repeat password"
                        value={confirmPassword} // Используем confirmPassword для повторного пароля
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <span>
                        <p></p>
                        <Link to="/SignIn">Sign In</Link>
                    </span>
                    <button type="submit">Sign Up</button>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
