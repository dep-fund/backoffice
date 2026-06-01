import { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import './CategoriesPage.css';
import { useNavigate } from 'react-router-dom';
import { deleteCategory } from '../services/categoriesService';
import { useAuthContext } from '../../../shared/context/AuthContext';
import { Plus, SquarePen, Trash2, AlertCircle } from 'lucide-react';

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('es-AR');

const CategoriesPage = () => {
  const { token } = useAuthContext();
  const { categories, loading, error, refresh } = useCategories();
  const navigate = useNavigate();
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      setDeleting(true);
      setDeleteError('');
      await deleteCategory(token, String(id));
      setCategoryToDelete(null);
      refresh();
    } catch (e: any) {
      if (e?.status === 400 || e?.statusCode === 400) {
        setDeleteError('No se puede eliminar una categoría asociada a proyectos.');
      } else {
        setDeleteError('No se pudo eliminar la categoría.');
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="categories-header">
        <span>{categories.length} categorías registradas</span>
        <button
          className="new-category-btn"
          onClick={() => navigate('/categories/create')}
        >
          <Plus size={16} />
          Nueva Categoría
        </button>
      </div>

      {error && <div className="categories-error">{error}</div>}

      <div className="categories-table-wrap">
        {loading ? (
          <div className="categories-loading">Cargando categorías...</div>
        ) : (
          <table className="categories-table">
            <thead>
              <tr>
                <th>NOMBRE</th>
                <th>DESCRIPCIÓN</th>
                <th>FECHA CREACIÓN</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="category-name">{category.name}</td>
                  <td>{category.description}</td>
                  <td>{formatDate(category.created_at)}</td>
                  <td>
                    <div className="category-actions">
                      <button
                        className="category-edit-btn"
                        onClick={() => navigate(`/categories/edit/${category.id}`)}
                      >
                        <SquarePen size={14} />
                        Editar
                      </button>
                      <button
                        className="category-delete-btn"
                        onClick={() => {
                          setDeleteError('');
                          setCategoryToDelete({ id: category.id, name: category.name });
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {categoryToDelete && (
        <div className="delete-modal-overlay" onClick={() => { if (!deleting) { setCategoryToDelete(null); setDeleteError(''); } }}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className={`delete-modal-icon ${deleteError ? 'delete-modal-icon--error' : ''}`}>
              {deleteError ? <AlertCircle size={28} /> : <Trash2 size={28} />}
            </div>
            <h3>¿Eliminar categoría?</h3>
            <p>Estás por eliminar <strong>{categoryToDelete.name}</strong>. Esta acción no se puede deshacer.</p>
            {deleteError && (
              <div className="delete-modal-error">
                {deleteError}
              </div>
            )}
            <div className="delete-modal-actions">
              <button
                className="delete-modal-cancel"
                onClick={() => { setCategoryToDelete(null); setDeleteError(''); }}
                disabled={deleting}
              >
                Cancelar
              </button>
              <button
                className="delete-modal-confirm"
                onClick={() => handleDelete(categoryToDelete.id)}
                disabled={deleting}
              >
                {deleting ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;