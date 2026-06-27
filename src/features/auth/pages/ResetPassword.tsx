import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/AuthService';
import logoDepFund from '@shared/img/logo_regency.jpg';
import './ResetPassword.css';

const validatePassword = (v: string) => {
  if (!v) return 'La contraseña es obligatoria';
  if (v.length < 8) return 'Debe tener al menos 8 caracteres';
  if (!/[A-Z]/.test(v)) return 'Debe contener al menos una mayúscula';
  if (!/[a-z]/.test(v)) return 'Debe contener al menos una minúscula';
  if (!/[0-9]/.test(v)) return 'Debe contener al menos un número';
  return '';
};

const validateConfirm = (pw: string, confirm: string) => {
  if (!confirm) return 'Debes confirmar la contraseña';
  if (pw !== confirm) return 'Las contraseñas no coinciden';
  return '';
};

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ newPassword?: string; confirmPassword?: string }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 3000);
      setError('Token de recuperación faltante. Serás redirigido al inicio de sesión...');
      return () => clearTimeout(timer);
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Token de recuperación no válido.');
      return;
    }

    const pwErr = validatePassword(newPassword);
    const confirmErr = validateConfirm(newPassword, confirmPassword);
    setErrors({ newPassword: pwErr, confirmPassword: confirmErr });

    if (pwErr || confirmErr) return;

    setLoading(true);

    try {
      await resetPassword({ token, new_password: newPassword });
      setSuccess(true);
    } catch (err: any) {
      if (err.status === 422 && Array.isArray(err.detail)) {
        const detailMsg = err.detail.map((d: any) => d.msg).join(', ');
        setError(`Error de validación: ${detailMsg}`);
      } else {
        setError(err.message || 'Error al restablecer la contraseña.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rp-page-container">
      <div className="rp-columns">

        {/* VISUAL SIDE */}
        <div className="rp-visual-side">
          <div className="rp-dark-overlay"></div>

          <div className="rp-visual-content">
            <img src={logoDepFund} alt="DepFund Logo" className="rp-brand-logo" />

            <h1 className="rp-visual-title">
              Nueva Seguridad.
            </h1>

            <p className="rp-visual-subtitle">
              Restablece tu contraseña para volver a gestionar tus inversiones.
            </p>
          </div>
        </div>

        {/* FORM SIDE */}
        <div className="rp-form-side">
          <div className="rp-form-wrapper">

            <header className="rp-auth-header">
              <h2>Restablecer Contraseña</h2>
              <p>Ingresa tu nueva contraseña a continuación.</p>
            </header>

            {error && (
              <div className="rp-error-box">
                {error}
              </div>
            )}

            {success ? (
              <div className="rp-success-box">
                <p>¡Contraseña actualizada con éxito!</p>
                <div style={{ marginTop: '20px' }}>
                  <Link to="/login" className="rp-button">
                    Ir al Inicio de Sesión <span className="rp-arrow">→</span>
                  </Link>
                </div>
              </div>
            ) : (
              token && (
                <form onSubmit={handleSubmit}>
                  <div className="rp-input-group">
                    <label htmlFor="newPassword">Nueva Contraseña</label>
                    <div className="rp-input-wrapper">
                      <input
                        type="password"
                        id="newPassword"
                        placeholder="••••••••••••"
                        value={newPassword}
                        onChange={(e) => { setNewPassword(e.target.value); setErrors(prev => ({ ...prev, newPassword: '' })); }}
                        onBlur={() => setErrors(prev => ({ ...prev, newPassword: validatePassword(newPassword) }))}
                        className={errors.newPassword ? 'input-error' : ''}
                      />
                      <span className="rp-input-highlight"></span>
                    </div>
                    {errors.newPassword && <span className="field-error">{errors.newPassword}</span>}
                  </div>

                  <div className="rp-input-group">
                    <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                    <div className="rp-input-wrapper">
                      <input
                        type="password"
                        id="confirmPassword"
                        placeholder="••••••••••••"
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); setErrors(prev => ({ ...prev, confirmPassword: '' })); }}
                        onBlur={() => setErrors(prev => ({ ...prev, confirmPassword: validateConfirm(newPassword, confirmPassword) }))}
                        className={errors.confirmPassword ? 'input-error' : ''}
                      />
                      <span className="rp-input-highlight"></span>
                    </div>
                    {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
                  </div>

                  <button
                    type="submit"
                    className="rp-button"
                    disabled={loading}
                  >
                    {loading ? 'Guardando...' : (
                      <>
                        Restablecer Contraseña
                        <span className="rp-arrow">→</span>
                      </>
                    )}
                  </button>
                </form>
              )
            )}

            <footer className="rp-footer">
              <p>
                ¿Recordaste tu contraseña?{' '}
                <Link to="/login" className="rp-link">
                  Inicia sesión
                </Link>
              </p>
            </footer>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;
