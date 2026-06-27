import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useRegister } from '../hooks/useRegister';
import './LoginPage.css';

const validateUsername = (v: string) => {
  if (!v.trim()) return 'El nombre de usuario es obligatorio';
  if (v.trim().length < 3) return 'El nombre de usuario debe tener al menos 3 caracteres';
  if (!/^[a-zA-Z0-9_.-]+$/.test(v.trim())) return 'Solo letras, números, _, ., -';
  return '';
};

const validateName = (v: string) => {
  if (!v.trim()) return 'El nombre es obligatorio';
  if (v.trim().length > 100) return 'Máximo 100 caracteres';
  return '';
};

const validateLastName = (v: string) => {
  if (!v.trim()) return 'El apellido es obligatorio';
  if (v.trim().length > 100) return 'Máximo 100 caracteres';
  return '';
};

const validateEmail = (v: string) => {
  if (!v.trim()) return 'El email es obligatorio';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return 'Formato de email inválido';
  return '';
};

const validatePassword = (v: string) => {
  if (!v) return 'La contraseña es obligatoria';
  if (v.length < 8) return 'Debe tener al menos 8 caracteres';
  if (!/[A-Z]/.test(v)) return 'Debe contener al menos una mayúscula';
  if (!/[a-z]/.test(v)) return 'Debe contener al menos una minúscula';
  if (!/[0-9]/.test(v)) return 'Debe contener al menos un número';
  return '';
};

const validateBirthdate = (v: string) => {
  if (!v) return 'La fecha de nacimiento es obligatoria';
  const d = new Date(v);
  if (isNaN(d.getTime())) return 'Fecha inválida';
  const min = new Date('1900-01-01');
  if (d < min) return 'Debe ser posterior a 1900-01-01';
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
  if (age < 18) return 'Debes ser mayor de 18 años';
  return '';
};

const RegisterPage = () => {
  const [form, setForm] = useState({
    admin_secret_key: '',
    username: '',
    name: '',
    last_name: '',
    email: '',
    password: '',
    image: '',
    birthdate: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { handleRegister, loading, error } = useRegister();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const handleBlur = (field: string) => {
    const validators: Record<string, (v: string) => string> = {
      username: validateUsername,
      name: validateName,
      last_name: validateLastName,
      email: validateEmail,
      password: validatePassword,
      birthdate: validateBirthdate,
    };
    const fn = validators[field];
    if (fn) {
      setErrors(prev => ({ ...prev, [field]: fn(form[field as keyof typeof form]) }));
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {
      admin_secret_key: form.admin_secret_key ? '' : 'La clave secreta es obligatoria',
      username: validateUsername(form.username),
      name: validateName(form.name),
      last_name: validateLastName(form.last_name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      birthdate: validateBirthdate(form.birthdate),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(e => e)) return;

    handleRegister({
      ...form,
      image: form.image || null,
    });
  };

  const fieldClass = (name: string) => `auth-input${errors[name] ? ' input-error' : ''}`;

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
              className={fieldClass('admin_secret_key')}
              type="password"
              name="admin_secret_key"
              placeholder="Clave secreta proporcionada"
              value={form.admin_secret_key}
              onChange={onChange}
            />
            {errors.admin_secret_key && <span className="field-error">{errors.admin_secret_key}</span>}
          </div>
          <div className="auth-field">
            <label className="auth-label">Nombre de Usuario *</label>
            <input
              className={fieldClass('username')}
              type="text"
              name="username"
              placeholder="admin_usuario"
              value={form.username}
              onChange={onChange}
              onBlur={() => handleBlur('username')}
            />
            {errors.username && <span className="field-error">{errors.username}</span>}
          </div>
          <div className="auth-row">
            <div className="auth-field">
              <label className="auth-label">Nombre *</label>
              <input
                className={fieldClass('name')}
                type="text"
                name="name"
                placeholder="Juan"
                value={form.name}
                onChange={onChange}
                onBlur={() => handleBlur('name')}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>
            <div className="auth-field">
              <label className="auth-label">Apellido *</label>
              <input
                className={fieldClass('last_name')}
                type="text"
                name="last_name"
                placeholder="Pérez"
                value={form.last_name}
                onChange={onChange}
                onBlur={() => handleBlur('last_name')}
              />
              {errors.last_name && <span className="field-error">{errors.last_name}</span>}
            </div>
          </div>
          <div className="auth-field">
            <label className="auth-label">Email *</label>
            <input
              className={fieldClass('email')}
              type="email"
              name="email"
              placeholder="admin@depfund.com"
              value={form.email}
              onChange={onChange}
              onBlur={() => handleBlur('email')}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          <div className="auth-field">
            <label className="auth-label">Contraseña *</label>
            <input
              className={fieldClass('password')}
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={onChange}
              onBlur={() => handleBlur('password')}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>
          <div className="auth-field">
            <label className="auth-label">Fecha de Nacimiento *</label>
            <input
              className={fieldClass('birthdate')}
              type="date"
              name="birthdate"
              value={form.birthdate}
              onChange={onChange}
              onBlur={() => handleBlur('birthdate')}
            />
            {errors.birthdate && <span className="field-error">{errors.birthdate}</span>}
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
