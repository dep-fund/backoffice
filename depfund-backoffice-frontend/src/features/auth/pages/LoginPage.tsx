import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '@shared/styles/auth.css';
import { loginAdmin, saveToken } from '../services/AuthService';
import type { ApiError } from '@shared/types/api.types';
import logoDepFund from '@shared/img/logo_regency.jpg';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword]     = useState('');
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { access_token } = await loginAdmin({ identifier, password });
      saveToken(access_token);
      navigate('/users');
    } catch (err) {
      const apiError = err as ApiError;
      setError(
        apiError.status === 401
          ? 'Usuario/email o contraseña incorrectos.'
          : 'Ocurrió un error. Intentá de nuevo.',
      );
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
            <h1 className="visual-title">Invierte en el futuro del deporte.</h1>
            <p className="visual-subtitle">Únete a la mayor red de inversión deportiva.</p>
          </div>
        </div>

        <div className="form-side">
          <div className="form-wrapper">
            <header className="auth-header">
              <h2>Bienvenido de nuevo</h2>
              <p>Introducí tus credenciales para acceder a tu panel.</p>
            </header>

            {error && <div className="error-banner">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">

              <div className="input-group">
                <label htmlFor="identifier">Usuario o Email</label>
                <div className="input-input-wrapper">
                  <input
                    type="text"
                    id="identifier"
                    placeholder="Tu usuario o correo"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value.replace(/\s/g, ''))}
                    required
                  />
                  <span className="input-highlight"></span>
                </div>
              </div>

              <div className="input-group">
                <div className="label-row">
                  <label htmlFor="password">Contraseña</label>
                </div>
                <div className="input-input-wrapper">
                  <input
                    type="password"
                    id="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value.replace(/\s/g, ''))}
                    required
                  />
                  <span className="input-highlight"></span>
                </div>
                <Link to="/forgot-password" className="forgot-link">¿Olvidaste tu contraseña?</Link>
              </div>

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Ingresando...' : 'Iniciar Sesión'}
                {!loading && <span className="button-arrow">→</span>}
              </button>
            </form>

            <footer className="auth-footer">
              <p>¿No tenés cuenta? <Link to="/register" className="signup-link">Creá una cuenta</Link></p>
            </footer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;