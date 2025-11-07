import { NavLink } from "react-router-dom";
import styles from "./LoginRequiredModal.module.css";

const LoginRequiredModal = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>Login required</h3>
        <p className={styles.text}>Please login to save your project.</p>
        <div className={styles.actions}>
          <button className={styles.secondary} onClick={onClose}>Cancel</button>
          <NavLink to="/login" className={styles.primary}> Login</NavLink>
        </div>
      </div>
    </div>
  );
};

export default LoginRequiredModal;
