import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/AuthService';
import logoDepFund from '@shared/img/logo_regency.jpg';
import './ForgotPasswordPage.css';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await forgotPassword({ email });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al enviar el correo de recuperación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fp-page-container">
      <div className="fp-columns">

        {/* VISUAL */}
        <div className="fp-visual-side">
          <div className="fp-dark-overlay"></div>

          <div className="fp-visual-content">
            <img src={logoDepFund} alt="DepFund Logo" className="fp-brand-logo" />

            <h1 className="fp-visual-title">
              Recupera tu acceso.
            </h1>

            <p className="fp-visual-subtitle">
              Protegemos tu inversión y tu seguridad.
            </p>
          </div>
        </div>

        {/* FORM */}
        <div className="fp-form-side">
          <div className="fp-form-wrapper">

            <header className="fp-auth-header">
              <h2>¿Olvidaste tu contraseña?</h2>
              <p style={{ marginTop: '10px', color: '#667085' }}>
                Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu acceso.
              </p>
            </header>

            {error && (
              <div className="fp-error-box">
                {error}
              </div>
            )}

            {success ? (
              <div className="fp-success-box">
                <p>¡Correo enviado!</p>
                <p style={{ fontSize: '0.9rem', marginTop: '10px', fontWeight: 'normal' }}>
                  Revisa tu bandeja de entrada. Te hemos enviado un enlace para restablecer tu contraseña.
                </p>

                <div style={{ marginTop: '25px' }}>
                  <Link to="/login" className="fp-button">
                    Volver al Login <span className="fp-arrow">→</span>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="fp-input-group">
                  <label>Email</label>
                  <div className="fp-input-wrapper">
                    <input
                      type="email"
                      name="email"
                      placeholder="correo@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <span className="fp-input-highlight"></span>
                  </div>
                </div>

                <button type="submit" className="fp-button" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
                  <span className="fp-arrow">→</span>
                </button>
              </form>
            )}

            <footer className="fp-footer">
              <p>
                ¿Recordaste tu contraseña?{' '}
                <Link to="/login" className="fp-link">
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

export default ForgotPassword;