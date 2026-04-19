import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '@shared/styles/auth.css';
import { post } from '../../../shared/services/httpClient';
import type { AdminUserCreateRequest, AdminUserResponse, ApiError } from '../../../shared/types/api.types';
import logoDepFund from '@shared/img/logo_regency.jpg';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    admin_secret_key: '',
    username: '',
    name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const noSpaces = ['username', 'email', 'password', 'confirmPassword', 'admin_secret_key'];
    const clean = noSpaces.includes(name) ? value.replace(/\s/g, '') : value.trimStart();
    setFormData({ ...formData, [name]: clean });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await post<AdminUserCreateRequest, AdminUserResponse>('/admin/users', {
        admin_secret_key: formData.admin_secret_key,
        username:         formData.username,
        name:             formData.name,
        last_name:        formData.last_name,
        email:            formData.email,
        password:         formData.password,
      }, false); // sin auth: el secret key es la "contraseña" de acceso

      navigate('/login');
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.status === 401 || apiError.status === 403) {
        setError('Clave secreta incorrecta.');
      } else if (apiError.status === 422) {
        setError('Datos inválidos. Revisá los campos e intentá de nuevo.');
      } else if (apiError.status === 409) {
        setError('El usuario o email ya existe.');
      } else {
        setError('Ocurrió un error al registrarte. Intentá de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-columns">

        <div className="visual-side">
          <div className="dark-overlay"></div>
          <div className="visual-content">
            <img src={logoDepFund} alt="DepFund Logo" className="brand-logo-visual" />
            <h1 className="visual-title">Panel de Administración.</h1>
            <p className="visual-subtitle">Registrate como administrador del sistema.</p>
          </div>
        </div>

        <div className="form-side">
          <div className="form-wrapper">
            <header className="auth-header">
              <h2>Crear cuenta de administrador</h2>
              <p>Necesitás la clave secreta para registrarte.</p>
            </header>

            {error && <div className="error-banner">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">

              <div className="input-group">
                <label htmlFor="admin_secret_key">Clave Secreta de Administrador</label>
                <div className="input-input-wrapper">
                  <input
                    type="password"
                    id="admin_secret_key"
                    name="admin_secret_key"
                    placeholder="••••••••••••"
                    value={formData.admin_secret_key}
                    onChange={handleChange}
                    required
                  />
                  <span className="input-highlight"></span>
                </div>
              </div>

              {[
                { id: 'name',      label: 'Nombre',   type: 'text',  placeholder: 'Tu nombre' },
                { id: 'last_name', label: 'Apellido', type: 'text',  placeholder: 'Tu apellido' },
                { id: 'username',  label: 'Usuario',  type: 'text',  placeholder: 'Nombre de usuario' },
                { id: 'email',     label: 'Email',    type: 'email', placeholder: 'correo@ejemplo.com' },
              ].map(({ id, label, type, placeholder }) => (
                <div className="input-group" key={id}>
                  <label htmlFor={id}>{label}</label>
                  <div className="input-input-wrapper">
                    <input
                      type={type}
                      id={id}
                      name={id}
                      placeholder={placeholder}
                      value={formData[id as keyof typeof formData]}
                      onChange={handleChange}
                      required
                    />
                    <span className="input-highlight"></span>
                  </div>
                </div>
              ))}

              {[
                { id: 'password',        label: 'Contraseña' },
                { id: 'confirmPassword', label: 'Repetir Contraseña' },
              ].map(({ id, label }) => (
                <div className="input-group" key={id}>
                  <label htmlFor={id}>{label}</label>
                  <div className="input-input-wrapper">
                    <input
                      type="password"
                      id={id}
                      name={id}
                      placeholder="••••••••••••"
                      value={formData[id as keyof typeof formData]}
                      onChange={handleChange}
                      required
                    />
                    <span className="input-highlight"></span>
                  </div>
                </div>
              ))}

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Registrando...' : 'Crear cuenta'}
                {!loading && <span className="button-arrow">→</span>}
              </button>
            </form>

            <footer className="auth-footer">
              <p>¿Ya tenés cuenta? <Link to="/login" className="signup-link">Iniciá sesión</Link></p>
            </footer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;