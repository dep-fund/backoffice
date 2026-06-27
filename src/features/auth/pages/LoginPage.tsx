import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import './LoginPage.css';

const validateIdentifier = (v: string) => {
  if (!v.trim()) return 'El usuario o email es obligatorio';
  return '';
};

const validatePassword = (v: string) => {
  if (!v) return 'La contraseña es obligatoria';
  if (v.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
  return '';
};

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});
  const { handleLogin, loading, error } = useLogin();

  const handleBlur = (field: 'identifier' | 'password') => {
    const fn = field === 'identifier' ? validateIdentifier : validatePassword;
    const val = field === 'identifier' ? identifier : password;
    setErrors(prev => ({ ...prev, [field]: fn(val) }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    const idErr = validateIdentifier(identifier);
    const pwErr = validatePassword(password);
    setErrors({ identifier: idErr, password: pwErr });

    if (idErr || pwErr) return;

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
              className={`auth-input${errors.identifier ? ' input-error' : ''}`}
              type="text"
              placeholder="admin@depfund.com"
              value={identifier}
              onChange={(e) => { setIdentifier(e.target.value); setErrors(prev => ({ ...prev, identifier: '' })); }}
              onBlur={() => handleBlur('identifier')}
            />
            {errors.identifier && <span className="field-error">{errors.identifier}</span>}
          </div>
          <div className="auth-field">
            <label className="auth-label">Contraseña</label>
            <input
              className={`auth-input${errors.password ? ' input-error' : ''}`}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })); }}
              onBlur={() => handleBlur('password')}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
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
