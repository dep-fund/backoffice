import { Plus, SquarePen } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import './CategoriesPage.css';
import { useNavigate } from 'react-router-dom';


const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('es-AR');

const CategoriesPage = () => {
  const { categories, loading, error } = useCategories();
  const navigate = useNavigate();

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
                    <button className="category-edit-btn">
                      <SquarePen size={14} />
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;