import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Auth
import LoginPage        from './features/auth/pages/LoginPage';
import RegisterPage     from './features/auth/pages/RegisterPage';
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage';

// Admin — Users
import UsersPage        from './features/admin/users/pages/UsersPage';
import UserRoleEditPage from './features/admin/users/pages/UserRoleEditPage';

// Admin — Roles
import RolesPage        from './features/admin/roles/pages/RolesPage';
import RoleEditPage     from './features/admin/roles/pages/RoleEditPage';

// Admin — Permissions
import PermissionsPage  from './features/admin/permissions/pages/PermissionEditPage';
import PermissionEditPage from './features/admin/permissions/pages/PermissionEditPage';

const App: React.FC = () => {
  return (
    
    <Routes>
      <Route path="/"                    element={<Navigate to="/login" />} />

      {/* Auth */}
      <Route path="/login"               element={<LoginPage />} />
      <Route path="/register"            element={<RegisterPage />} />
      <Route path="/forgot-password"     element={<ForgotPasswordPage />} />

      {/* Admin */}
      <Route path="/users"               element={<UsersPage />} />
      <Route path="/users/edit-role/:id" element={<UserRoleEditPage />} />
      <Route path="/roles"               element={<RolesPage />} />
      <Route path="/roles/edit/:id"      element={<RoleEditPage />} />
      <Route path="/permisos"            element={<PermissionsPage />} />
      <Route path="/permisos/edit/:id"   element={<PermissionEditPage />} />
    </Routes>
  );
};

export default App;