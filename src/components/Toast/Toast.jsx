// Caminho do arquivo: src/components/Toast/Toast.jsx

import React from 'react';
import styles from './Toast.module.css';

const Toast = ({ message, icon }) => {
    return (
        <div className={styles.toastItem}>
            <img src={icon} alt="" className={styles.toastIcon} />
            <span className={styles.toastMessage}>{message}</span>
        </div>
    );
};

export default Toast;

