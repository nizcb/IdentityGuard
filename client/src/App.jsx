import "./App.css";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import AdminDashboard from "./pages/Admin/Dashboard";
import Verifier_page from "./pages/Verifier/Verifier";

import RefusedDashboard from "./pages/Dashboard/RefusedDashboard";

import { Toaster } from "react-hot-toast";
import { UserContextProvider } from "./context/userContext";
import axiosConfig from "./config/axiosConfig";

function App() {
  return (
    <UserContextProvider>
      <Toaster position="bottom-center" toastOptions={{ duration: 5000 }} />
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/verifiers" element={<Verifier_page />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/refusedDashboard" element={<RefusedDashboard />} />
      </Routes>
    </UserContextProvider>
  );
}

export default App;
