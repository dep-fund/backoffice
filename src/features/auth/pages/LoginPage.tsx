import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import './LoginPage.css';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin, loading, error } = useLogin();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleLogin(identifier, password);
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-text">
            <span className="auth-logo-dep">Dep</span>
            <span className="auth-logo-fund">Fund</span>
          </span>
        </div>
        <p className="auth-subtitle">Panel Administrativo</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={onSubmit}>
          <div className="auth-field">
            <label className="auth-label">Usuario o Email</label>
            <input
              className="auth-input"
              type="text"
              placeholder="admin@depfund.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>
          <div className="auth-field">
            <label className="auth-label">Contraseña</label>
            <input
              className="auth-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <hr className="auth-divider" />
        <div className="auth-link-row">
          <Link to="/register" className="auth-link">
            ¿No tienes cuenta? Regístrate como administrador
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
