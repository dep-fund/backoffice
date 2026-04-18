import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '@shared/styles/auth.css';
import { registerUser } from '../../admin/users/services/UserService';
import type { ApiError } from '../../../shared/types/api.types';
import logoDepFund from '@shared/img/logo_regency.jpg';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    usuario: '',
    fechaNacimiento: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const isOlderThan18 = (dateString: string) => {
    if (!dateString) return false;
    const today     = new Date();
    const birthDate = new Date(dateString);
    let age         = today.getFullYear() - birthDate.getFullYear();
    const month     = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) age--;
    return age >= 18;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const noSpaces = ['usuario', 'email', 'password', 'confirmPassword'];
    const clean    = noSpaces.includes(name)
      ? value.replace(/\s/g, '')
      : value.trimStart();
    setFormData({ ...formData, [name]: clean });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isOlderThan18(formData.fechaNacimiento)) {
      setError('Debés ser mayor de 18 años para registrarte.');
      return;
    }
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
      await registerUser({
        username:  formData.usuario,
        name:      formData.nombre,
        last_name: formData.apellido,
        birthdate: formData.fechaNacimiento || null,
        email:     formData.email,
        password:  formData.password,
      });
      // Registro exitoso → al login
      navigate('/login');
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.status === 422) {
        setError('Datos inválidos. Revisá los campos e intentá de nuevo.');
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
            <h1 className="visual-title">Comienza tu viaje deportivo hoy.</h1>
            <p className="visual-subtitle">Sé parte de la nueva era de inversión.</p>
          </div>
        </div>

        <div className="form-side">
          <div className="form-wrapper">
            <header className="auth-header">
              <h2>Creá tu cuenta</h2>
              <p>Uníte a DepFund y empezá a invertir.</p>
            </header>

            {error && <div className="error-banner">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">

              {[
                { id: 'nombre',    label: 'Nombre',    type: 'text',     placeholder: 'Tu nombre' },
                { id: 'apellido',  label: 'Apellido',  type: 'text',     placeholder: 'Tu apellido' },
                { id: 'usuario',   label: 'Usuario',   type: 'text',     placeholder: 'Nombre de usuario' },
                { id: 'email',     label: 'Email',     type: 'email',    placeholder: 'correo@ejemplo.com' },
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

              <div className="input-group">
                <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
                <div className="input-input-wrapper">
                  <input
                    type="date"
                    id="fechaNacimiento"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    required
                  />
                  <span className="input-highlight"></span>
                </div>
              </div>

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
                {loading ? 'Registrando...' : 'Registrarse'}
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