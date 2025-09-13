// Caminho: src/components/Modal/Modal.jsx
import React from 'react';
import styles from './Modal.module.css';

const Modal = ({ children, onClose }) => {
    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className={styles.modalCloseButton}>×</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;