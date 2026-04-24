import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
<<<<<<< HEAD:src/features/auth/pages/RegisterPage.tsx
import '@shared/styles/auth.css';
import { post } from '../../../shared/services/httpClient';
import type { AdminUserCreateRequest, AdminUserResponse, ApiError } from '../../../shared/types/api.types';
import logoDepFund from '../../../shared/img/logo_regency.jpg';
=======
import { post } from '@shared/services/httpClient';
import type { AdminUserCreateRequest, AdminUserResponse, ApiError } from '@shared/types/api.types';
import logoDepFund from '@shared/img/logo_regency.jpg';
import './RegisterPage.css';
>>>>>>> arreglando-front:depfund-backoffice-frontend/src/features/auth/pages/RegisterPage.tsx

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

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const noSpaces = [
      'username',
      'email',
      'password',
      'confirmPassword',
      'admin_secret_key'
    ];

    const clean = noSpaces.includes(name)
      ? value.replace(/\s/g, '')
      : value.trimStart();

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
      await post<AdminUserCreateRequest, AdminUserResponse>(
        '/admin/users',
        {
          admin_secret_key: formData.admin_secret_key,
          username: formData.username,
          name: formData.name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password,
        },
        false
      );

      navigate('/login');

    } catch (err) {
      const apiError = err as ApiError;

      if (apiError.status === 401 || apiError.status === 403) {
        setError('Clave secreta incorrecta.');
      } else if (apiError.status === 422) {
        setError('Datos inválidos. Revisá los campos.');
      } else if (apiError.status === 409) {
        setError('El usuario o email ya existe.');
      } else {
        setError('Ocurrió un error. Intentá de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-register-page-container">
      <div className="register-register-columns">

        {/* VISUAL SIDE */}
        <div className="register-visual-side">
          <div className="register-dark-overlay"></div>

          <div className="register-visual-content">
            <img
              src={logoDepFund}
              alt="DepFund Logo"
              className="register-brand-logo"
            />

            <h1 className="register-visual-title">
              Panel de Administración
            </h1>

            <p className="register-visual-subtitle">
              Creá un usuario administrador del sistema
            </p>
          </div>
        </div>

        {/* FORM SIDE */}
        <div className="register-form-side">
          <div className="register-form-wrapper">

            <header className="register-auth-header">
              <h2>Crear admin</h2>
              <p>Ingresá la clave secreta para continuar</p>
            </header>

            {error && (
              <div className="register-error-message">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* SECRET */}
              <div className="register-input-group">
                <label>Clave Secreta</label>
                <div className="register-input-wrapper">
                  <input
                    type="password"
                    name="admin_secret_key"
                    placeholder="Ingresá la clave secreta"
                    value={formData.admin_secret_key}
                    onChange={handleChange}
                    required
                  />
                  <span className="register-input-highlight"></span>
                </div>
              </div>

              {/* INPUTS */}
              {[
                { id: 'name', label: 'Nombre', type: 'text', placeholder: 'Tu nombre' },
                { id: 'last_name', label: 'Apellido', type: 'text', placeholder: 'Tu apellido' },
                { id: 'username', label: 'Usuario', type: 'text', placeholder: 'Nombre de usuario' },
                { id: 'email', label: 'Email', type: 'email', placeholder: 'correo@ejemplo.com' },
              ].map(({ id, label, type, placeholder }) => (
                <div className="register-input-group" key={id}>
                  <label>{label}</label>
                  <div className="register-input-wrapper">
                    <input
                      type={type}
                      name={id}
                      placeholder={placeholder}
                      value={formData[id as keyof typeof formData]}
                      onChange={handleChange}
                      required
                    />
                    <span className="register-input-highlight"></span>
                  </div>
                </div>
              ))}

              {/* PASSWORD */}
              <div className="register-input-group">
                <label>Contraseña</label>
                <div className="register-input-wrapper">
                  <input
                    type="password"
                    name="password"
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <span className="register-input-highlight"></span>
                </div>
              </div>

              {/* CONFIRM */}
              <div className="register-input-group">
                <label>Repetir Contraseña</label>
                <div className="register-input-wrapper">
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Repetí la contraseña"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <span className="register-input-highlight"></span>
                </div>
              </div>

              <button
                type="submit"
                className="register-register-button"
                disabled={loading}
              >
                {loading ? 'Registrando...' : 'Crear cuenta admin'}
              </button>

            </form>

            <footer className="register-auth-footer">
              <p>
                ¿Ya tenés cuenta?{' '}
                <Link to="/login" className="register-signup-link">
                  Iniciá sesión
                </Link>
              </p>
            </footer>

          </div>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;