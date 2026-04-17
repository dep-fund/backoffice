import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./features/auth.login/components/Login";
import Register from "./features/auth.login/components/Register";
import ForgotPassword from "./features/auth.login/components/ForgotPassword";
import RolesManager from "./features/admin.users/components/RolesManager";
import RoleEdit from "./features/admin.users/components/RoleEdit";
import PermiseManager from "./features/admin.users/components/PermiseManager";
import PermiseEdit from "./features/admin.users/components/PermiseEdit";
import Users from "./features/admin.users/components/Users";
import UserRolEdit from "./features/admin.users/components/UserRolEdit";

const App: React.FC = () => {
  return (
    <Routes>
      {/* Redirige la raíz (/) al login por defecto */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/roles" element={<RolesManager />} />
      <Route path="/roles/edit/:id" element={<RoleEdit />} />
      <Route path="/permisos" element={<PermiseManager />} />
      <Route path="/permisos/edit/:id" element={<PermiseEdit />} />
      <Route path="/users" element={<Users />} />
      <Route path="/users/edit-role/:id" element={<UserRolEdit />} />
    </Routes>
  );
};

export default App;