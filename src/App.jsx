import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux'; // Redux Provider
import store from './Components/store.jsx'; // Redux store
import SignUp from './Pages/SignUp.jsx';
import SignIn from './Pages/SignIn.jsx';
import Layout from './Pages/Layout.jsx';
import Dashboard from './Components/Dashboard.jsx';
import Transactions from './Components/Transactions.jsx';
import Settings from './Components/Settings.jsx';
import PasswordReset from './Pages/PasswordReset.jsx';
import { ToastContainer, Bounce } from 'react-toastify'; // Импорт ToastContainer и Bounce
import 'react-toastify/dist/ReactToastify.css'; // Импорт стилей для Toastify

function App() {
  return (
    <Provider store={store}> {/* Обертка Router в Provider для Redux */}
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/SignUp" />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/PasswordReset" element={<PasswordReset />} /> {/* Независимый Route */}
          <Route path="/Layout" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
        {/* ToastContainer должен быть размещён снаружи блока Routes */}
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
      </Router>
    </Provider>
  );
}

export default App;
