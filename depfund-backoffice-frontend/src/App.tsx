import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./features/auth.login/components/Login";
import Register from "./features/auth.login/components/Register";
import RoleManager from "./features/admin.users/components/RoleManager";
import RoleEdit from "./features/admin.users/components/RoleEdit";

const App: React.FC = () => {
  return (
    <Routes>
      {/* Redirige la raíz (/) al login por defecto */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/role-manager" element={<RoleManager />} />
      <Route path="/role-edit" element={<RoleEdit />} />      
    </Routes>
  );
};

export default App;