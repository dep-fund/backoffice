import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    getCategoryById,
    updateCategory,
  } from '../services/categoriesService';
import './EditCategoryPage.css';

const EditCategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem('admin_token') || '';

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
  
        const category = await getCategoryById(
          token,
          id!,
        );
  
        setName(category.name);
        setDescription(category.description);
      } catch {
        setError('No se pudo cargar la categoría');
      } finally {
        setLoading(false);
      }
    };
  
    fetchCategory();
  }, [id, token]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      await updateCategory(token, id!, {
        name,
        description,
      });

      navigate('/categories');
    } catch {
      setError('No se pudo actualizar la categoría');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-category-page">
      <form
        className="edit-category-form"
        onSubmit={handleSubmit}
      >
        <h1>Editar Categoría</h1>
  
        <div className="form-group">
          <label>Nombre</label>
  
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
  
        <div className="form-group">
          <label>Descripción</label>
  
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
  
        {error && (
          <div className="edit-category-error">
            {error}
          </div>
        )}
  
        <button
          type="submit"
          className="edit-category-btn"
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
};

export default EditCategoryPage;