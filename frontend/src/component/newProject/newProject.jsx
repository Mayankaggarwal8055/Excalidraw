import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NewProject.module.css";
// import { Pencil } from "lucide-react"; // optional icon

const NewProject = () => {
  const navigate = useNavigate();

  const openExcalidraw = () => {
    navigate("/excalidraw");
  };

  return (
    <section className={styles.hero}>
      <div
        className={styles.card}
        role="button"
        tabIndex={0}
        onClick={openExcalidraw}
        onKeyDown={(e) => e.key === "Enter" && openExcalidraw()}
      >
        {/* <div className={styles.badge}>
          <Pencil size={28} />
        </div> */}

        <div className={styles.content}>
          <h2 className={styles.heading}>New Drawing</h2>
          <p className={styles.sub}>
            Start a blank canvas in <strong>Excalidraw</strong> — sketch, plan, or design visually.
          </p>
          <button className={styles.cta}>Create & Open Canvas</button>
        </div>

        <div className={styles.glow} />
      </div>
    </section>
  );
};

export default NewProject;
