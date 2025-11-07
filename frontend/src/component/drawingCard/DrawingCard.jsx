import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DrawingCard.module.css";

const DrawingCard = ({ drawing, onDelete }) => {
    const navigate = useNavigate();

    const openDrawing = () => navigate(`/excalidraw/${drawing.id}`);

    return (
        <article
            className={styles.card}
            onClick={openDrawing}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && openDrawing()}
        >
            <div className={styles.thumb}>
                {drawing.thumbnail ? (
                    <img
                        src={drawing.thumbnail}
                        alt={drawing.title}
                        className={styles.thumbImage}
                    />
                ) : (
                    <div className={styles.emptyPreview}>No Preview</div>
                )}
                <div className={styles.badge}>DRAWING</div>
            </div>

            <div className={styles.meta}>
                <span className={styles.date}>
                    {new Date(drawing.updatedAt).toLocaleString()}
                </span>
                <div className={styles.actions}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openDrawing();
                        }}
                        className={styles.openBtn}
                    >
                        Open
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(drawing.id);
                        }}
                        className={styles.deleteBtn}
                    >
                        Delete
                    </button>
                </div>
            </div>

            <div className={styles.glow} />
        </article>
    );
};

export default DrawingCard;
