import { AuthContextProvider } from "./context/authContext";
import { ToolContextProvider } from "./context/ToolContext";
import { Route, Routes } from "react-router-dom";
import SignUpPage from "./pages/signUpPage/signUpPage";
import LoginPage from "./pages/loginPage/loginPage";
import Home from "./pages/home/Home";
import "./App.css";
import ExcalidrawPage from "./pages/ExcalidrawPage";

export default function App() {
  return (
    <AuthContextProvider>
      <ToolContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/excalidraw" element={<ExcalidrawPage />} />
          <Route path="/excalidraw/:id" element={<ExcalidrawPage />} />
        </Routes>
      </ToolContextProvider>
    </AuthContextProvider>
  );
}
