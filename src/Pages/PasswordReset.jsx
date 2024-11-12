import React, { useState } from 'react';
import LeftLogo from "../Components/LeftLogo";
import styles from './PasswordReset.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PasswordReset() {
    const [email, setEmail] = useState('');
    const auth = getAuth();
    const navigate = useNavigate();

    const handlePasswordReset = async (event) => {
        event.preventDefault();

        if (!email) {
            toast.error('Please enter your email.');
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            toast.success('Password reset link has been sent to your email.');
            // navigate('/SignIn');
        } catch (error) {
            // Обработка ошибок Firebase, в том числе `auth/user-not-found`
            if (error.code === 'auth/user-not-found') {
                toast.error('No account found with this email.');
            } 
            else {
                toast.error(`Error: ${error.message}`);
            }
        }
    };

    return (
        <div className={styles.PasswordReset}>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />

            <LeftLogo />
            <div className={styles.right}>
                <span className={styles.bigText}>
                    Password Reset
                </span>
                <span className={styles.smallText}>
                    Enter the email address associated with your account, and we will send you a link to reset your password.
                </span>
                
                <form onSubmit={handlePasswordReset} className={styles.resetForm}>
                    <input 
                        type="email" 
                        required 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                    <button type="submit">Send Link</button>
                </form>

                <div className={styles.linkWrap}>
                    <span className={styles.smallText1}>
                        Don't have an account? <Link to="/SignUp" className={styles.link}>Sign Up</Link>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default PasswordReset;
