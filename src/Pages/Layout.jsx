import React, { useState, useEffect } from "react"; // Добавляем useState и useEffect
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Добавляем Firebase auth
import LeftMenu from "../Components/LeftMenu";
import { Outlet } from "react-router-dom"; // Import Outlet
import styles from "./Layout.module.scss";
import Header from "../Components/Header";
import Dashboard from "../Components/Dashboard";
import AddTransactions from "../Components/AddTransactions";
import Transactions from "../Components/Transactions";
import { DataProvider } from '../Components/DataProvider'; // Импортируйте DataProvider
import { ToastContainer } from 'react-toastify';
function Layout() {
  

  return (
    <DataProvider>
    <div className={styles.Layout}>
      {/* Левая часть - меню */}
      <div>
        <LeftMenu />
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition="bounce"
      />
      {/* Правая часть - контент страницы */}
      <div className={styles.content}>
            {/* Показываем email пользователя */}
        <Outlet /> {/* This is where nested routes will be rendered */}
      </div>
    </div></DataProvider>
  );
}

export default Layout;
