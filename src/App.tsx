import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import CategoriesPage from './features/categories/pages/CategoriesPage';
import CreateCategoryPage from './features/categories/pages/CreateCategoryPage';
import EditCategoryPage from './features/categories/pages/EditCategoryPage';
import ProjectsPage from './features/projects/pages/ProjectsPage';
import ProjectDetailPage from './features/projects/pages/ProjectDetailPage';
import UsersPage from './features/users/pages/UsersPage';
import ProfilePage from './features/profile/pages/ProfilePage';
import RolesPage from './features/roles/pages/RolesPage';
import PermissionsPage from './features/permissions/pages/PermissionsPage';
import RolePermissionsPage from './features/rolePermission/pages/RolePermissionPage';
import Layout from './shared/components/Layout/Layout';

import { AuthProvider, useAuthContext } from './shared/context/AuthContext';

const ProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { token, loading } = useAuthContext();

  if (loading) return null;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const PublicRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { token, loading } = useAuthContext();

  if (loading) return null;

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
    <Route path="/profile"element={<ProtectedRoute><Layout><ProfilePage /></Layout></ProtectedRoute>}/>
    <Route path="/dashboard" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>} />
    <Route path="/users" element={<ProtectedRoute><Layout><UsersPage /></Layout></ProtectedRoute>} />
    <Route path="/projects" element={<ProtectedRoute><Layout><ProjectsPage /></Layout></ProtectedRoute>} />
    <Route path="/projects/:id" element={<ProtectedRoute><Layout><ProjectDetailPage /></Layout></ProtectedRoute>} />
    <Route path="/categories" element={<ProtectedRoute><Layout><CategoriesPage /></Layout></ProtectedRoute>} />
    <Route path="/categories/create" element={<ProtectedRoute><Layout><CreateCategoryPage /></Layout></ProtectedRoute>} />
    <Route path="/categories/edit/:id" element={<ProtectedRoute><Layout><EditCategoryPage /></Layout></ProtectedRoute>}/>
    <Route path="/roles" element={<ProtectedRoute><Layout><RolesPage /></Layout></ProtectedRoute>}/>
    <Route path="/role-permissions"element={<ProtectedRoute><Layout><RolePermissionsPage /></Layout></ProtectedRoute>}/>
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
    <Route path="/permissions"element={<ProtectedRoute><Layout><PermissionsPage /></Layout></ProtectedRoute>}/>
  </Routes>
);

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;