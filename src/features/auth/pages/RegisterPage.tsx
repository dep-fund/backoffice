import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useRegister } from '../hooks/useRegister';
import './LoginPage.css';

const RegisterPage = () => {
  const [form, setForm] = useState({
    admin_secret_key: '',
    username: '',
    name: '',
    last_name: '',
    email: '',
    password: '',
    image: '',
    birthdate:''
  });
  const { handleRegister, loading, error } = useRegister();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleRegister({
      ...form,
      image: form.image || null,
    });
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
            <label className="auth-label">Clave Secreta de Admin *</label>
            <input
              className="auth-input"
              type="password"
              name="admin_secret_key"
              placeholder="Clave secreta proporcionada"
              value={form.admin_secret_key}
              onChange={onChange}
              required
            />
          </div>
          <div className="auth-field">
            <label className="auth-label">Nombre de Usuario *</label>
            <input
              className="auth-input"
              type="text"
              name="username"
              placeholder="admin_usuario"
              value={form.username}
              onChange={onChange}
              required
            />
          </div>
          <div className="auth-row">
            <div className="auth-field">
              <label className="auth-label">Nombre *</label>
              <input
                className="auth-input"
                type="text"
                name="name"
                placeholder="Juan"
                value={form.name}
                onChange={onChange}
                required
              />
            </div>
            <div className="auth-field">
              <label className="auth-label">Apellido *</label>
              <input
                className="auth-input"
                type="text"
                name="last_name"
                placeholder="Pérez"
                value={form.last_name}
                onChange={onChange}
                required
              />
            </div>
          </div>
          <div className="auth-field">
            <label className="auth-label">Email *</label>
            <input
              className="auth-input"
              type="email"
              name="email"
              placeholder="admin@depfund.com"
              value={form.email}
              onChange={onChange}
              required
            />
          </div>
          <div className="auth-field">
            <label className="auth-label">Contraseña *</label>
            <input
              className="auth-input"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={onChange}
              required
            />
          </div>
          <div className="auth-field">
          <label className="auth-label">Fecha de Nacimiento *</label>
          <input
            className="auth-input"
            type="date"
            name="birthdate"
            value={form.birthdate}
            onChange={onChange}
            required
          />
        </div>
          
          <div className="auth-field">
            <label className="auth-label">URL de Imagen (opcional)</label>
            <input
              className="auth-input"
              type="url"
              name="image"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={form.image}
              onChange={onChange}
            />
          </div>
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <hr className="auth-divider" />
        <div className="auth-link-row">
          <Link to="/login" className="auth-link">
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
