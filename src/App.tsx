import { Routes, Route} from "react-router-dom";
import Login from "@/pages/auth/Login";
import SignUp from "@/pages/auth/Signup";
import ForgotPasswordPage from "@/pages/auth/ForgotPassword";
import UpdatePasswordPage from "@/pages/auth/UpdatePassword";
import ImageEditor from "@/pages/image-editor/ImageEditor";
import './App.css';
import PatientList from "./pages/patient-lists/PatientList";
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/update-password" element={<UpdatePasswordPage />} />
        <Route path="/edit-image" element={<ImageEditor />} />
        <Route path="/list-patients" element={<PatientList />} />
      </Routes>
    </div>
  )
}

export default App
