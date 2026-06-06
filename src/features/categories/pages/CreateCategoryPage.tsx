import { useState } from 'react';
import { createCategory } from '../services/categoriesService';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../shared/context/AuthContext';
import './CreateCategoryPage.css';

const CreateCategoryPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] =useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
    const { token } = useAuthContext();

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!token) return;

    try {
      setLoading(true);
      setError('');

      await createCategory(token, {
        name,
        description,
      });

      navigate('/categories');
    } catch {
      setError(
        'No se pudo crear la categoría'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-category-page">
      <form
        className="create-category-form"
        onSubmit={handleSubmit}
      >
        <h1>Nueva Categoría</h1>

        {error && (
          <div className="create-category-error">
            {error}
          </div>
        )}

        <div className="form-group">
          <label>Nombre</label>

          <input
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Tecnología"
            required
          />
        </div>

        <div className="form-group">
          <label>Descripción</label>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="Descripción"
            required
          />
        </div>

        <button
          type="submit"
          className="create-category-btn"
          disabled={loading}
        >
          {loading
            ? 'Creando...'
            : 'Crear Categoría'}
        </button>
      </form>
    </div>
  );
};

export default CreateCategoryPage;