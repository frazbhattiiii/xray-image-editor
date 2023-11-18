import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/auth/Login";
import SignUp from "@/pages/auth/Signup";
import ForgotPasswordPage from "@/pages/auth/ForgotPassword";
import UpdatePasswordPage from "@/pages/auth/UpdatePassword";
import ImageEditor from "@/pages/image-editor/ImageEditor";
import PatientList from "@/pages/patient-lists/PatientList";
import ImageUpload from "@/pages/image-upload/ImageUpload";
import Timeline from "@/pages/timeline/Timeline";
import Home from "./pages/Home";
import "./App.css";

const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({
  element,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const accessToken = localStorage.getItem("access_token");
    return !!accessToken;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const accessToken = localStorage.getItem("access_token");
      setIsLoggedIn(!!accessToken);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return <>{element}</>;
};

const App = () => {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/update-password" element={<UpdatePasswordPage />} />

        {/* Protected routes */}
        <Route
          path="/edit-image"
          element={<ProtectedRoute element={<ImageEditor />} />}
        />
        <Route
          path="/list-patients"
          element={<ProtectedRoute element={<PatientList />} />}
        />
        <Route
          path="/upload-image"
          element={<ProtectedRoute element={<ImageUpload />} />}
        />
        <Route
          path="/timeline"
          element={<ProtectedRoute element={<Timeline />} />}
        />
      </Routes>
    </div>
  );
};

export default App;
