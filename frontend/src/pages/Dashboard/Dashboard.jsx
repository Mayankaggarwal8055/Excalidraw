// src/pages/Dashboard/Dashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import NewProject from "../../component/newProject/newProject";
import DrawingCard from "../../component/drawingCard/DrawingCard";
import { AuthContext } from "../../context/authContext";
import "./Dashboard.css"; // optional for layout styling
import { deleteDrawing, getUserDrawings } from "../../api/saveDrawing";

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);

  console.log(user);

  const [drawings, setDrawings] = useState([]);

  useEffect(() => {

    if (!user || loading) return;

    const fetchDrawings = async () => {
      try {
        const data = await getUserDrawings(user.id);
        setDrawings(data.drawings);
      } catch (err) {
        console.error("Error fetching drawings:", err);
      }
    };
    if (user) fetchDrawings();
  }, [user]);

  const handleDelete = async (id) => {
    try {
      await deleteDrawing(id);
      setDrawings((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Error deleting drawing:", err);
    }
  };

  return (
    <>
      <div className="dashboard-wrap">
        <NewProject />
        <div className="drawing-grid">
          {drawings.length === 0 ? (
            <p className="no-drawings">No drawings yet</p>
          ) : (
            drawings.map((drawing) => (
              <DrawingCard
                key={drawing.id}
                drawing={drawing}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
