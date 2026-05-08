import {
  Mail,
  User,
  Calendar,
  Shield,
} from 'lucide-react';

import { useProfile } from '../hooks/useProfile';

import './ProfilePage.css';

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const getInitials = (name: string, lastName: string) =>
  `${name.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

const ProfilePage = () => {
  const { profile, loading, error } = useProfile();

  if (loading) {
    return <div className="profile-loading">Cargando perfil...</div>;
  }

  if (error || !profile) {
    return <div className="profile-error">{error}</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-banner" />

        <div className="profile-content">
          <div className="profile-avatar">
            {profile.image ? (
              <img src={profile.image} alt={profile.username} />
            ) : (
              getInitials(profile.name, profile.last_name)
            )}
          </div>

          <div className="profile-main">
            <div className="profile-header">
              <div>
                <h2>
                  {profile.name} {profile.last_name}
                </h2>

                <span>@{profile.username}</span>
              </div>

              <div className={`profile-status ${profile.blocked ? 'blocked' : 'active'}`}>
                {profile.blocked ? 'Bloqueado' : 'Activo'}
              </div>
            </div>

            <div className="profile-grid">
              <div className="profile-item">
                <div className="profile-item-icon">
                  <Mail size={18} />
                </div>

                <div>
                  <span>Email</span>
                  <strong>{profile.email}</strong>
                </div>
              </div>

              <div className="profile-item">
                <div className="profile-item-icon">
                  <User size={18} />
                </div>

                <div>
                  <span>Usuario</span>
                  <strong>{profile.username}</strong>
                </div>
              </div>

              <div className="profile-item">
                <div className="profile-item-icon">
                  <Calendar size={18} />
                </div>

                <div>
                  <span>Fecha de registro</span>
                  <strong>{formatDate(profile.created_at)}</strong>
                </div>
              </div>

              <div className="profile-item">
                <div className="profile-item-icon">
                  <Shield size={18} />
                </div>

                <div>
                  <span>Estado</span>
                  <strong>
                    {profile.activated ? 'Cuenta activada' : 'Cuenta inactiva'}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;