import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, signInWithEmailAndPassword } from './firebaseConfig';
import styles from './SignUp.module.scss';
import LeftLogo from '../Components/LeftLogo';
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Импорт стилей Toastify

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignIn = async (event) => {
        event.preventDefault();

        try {
            await signInWithEmailAndPassword(auth, email, password);
          
            navigate('/Layout/dashboard', { state: { activeElement: '/Layout/dashboard' } });
        } catch (error) {
            console.error('Error signing in user:', error.message);

            // Обработка всех возможных ошибок Firebase при входе
            switch (error.code) {
                case 'auth/invalid-email':
                    toast.error('Invalid email format. Please check your email.', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        transition: Bounce,
                    });
                    break;
                case 'auth/user-disabled':
                    toast.error('Your account has been disabled. Please contact support.', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        transition: Bounce,
                    });
                    break;
                case 'auth/user-not-found':
                    toast.error('No account found with this email.', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        transition: Bounce,
                    });
                    break;
                case 'auth/wrong-password':
                    toast.error('Incorrect password. Please try again.', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        transition: Bounce,
                    });
                    break;
                case 'auth/too-many-requests':
                    toast.error('Too many failed attempts. Please try again later.', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        transition: Bounce,
                    });
                    break;
                case 'auth/network-request-failed':
                    toast.error('Network error. Please check your connection and try again.', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        transition: Bounce,
                    });
                    break;
                case 'auth/internal-error':
                    toast.error('Internal error. Please try again later.', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        transition: Bounce,
                    });
                    break;
                default:
                    toast.error('Failed to sign in. Please try again.', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        transition: Bounce,
                    });
                    break;
            }
        }
    };

    return (
        <div className={styles.signIn}>
            <LeftLogo />
            <div className={styles.right}>
                <p>Sign In</p>
                <form onSubmit={handleSignIn}>
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
                    <span>
                        <Link to="/PasswordReset">Forgot password?</Link>
                        <Link to="/SignUp">Sign Up</Link>
                    </span>
                    <button type="submit">Sign In</button>
                </form>
            </div>
        </div>
    );
}

export default SignIn;
