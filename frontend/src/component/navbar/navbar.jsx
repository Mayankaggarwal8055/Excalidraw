import { NavLink } from "react-router-dom";
import styles from "./navbar.module.css";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const Navbar = () => { 
  const { user } = useContext(AuthContext);

  return (
    <nav className={styles.navbar}>
      <NavLink to="/" className={styles.navBrand}>
        excalidraw
      </NavLink>

      <div className={styles.navLinks}>
        {user ? (
          <span className={styles.navUser} title={user.email}>
            {user.name || "User"}
          </span>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ""}`
            }
          >
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
