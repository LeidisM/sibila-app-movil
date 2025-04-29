'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import api from '../../../components/Api';
import PrivateRoute from '../../../components/PrivateRoute';
import '../../../../app/styles/formStyles.css';
import '../../../../app/styles/style.css';

export default function EditarLibroPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [libro, setLibro] = useState({
    titulo: '',
    autor: '',
    editorial: '',
    isbn: '',
    subcategoria: '',
    tipoMaterial: '',
    estado: 0
  });

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchLibro = async () => {
      try {
        const response = await api.get(`/Libros/${id}`);
        setLibro(response.data);
      } catch (error) {
        console.error("Error al obtener el libro:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLibro();
  }, [id]);

  const validate = () => {
    const newErrors = {};
    if (!libro.titulo) newErrors.titulo = 'Título requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await api.put(`/Libros/${id}`, libro);
      setShowSuccess(true);
      setTimeout(() => {
        router.push('/libros');
      }, 1500);
    } catch (error) {
      console.error("Error al actualizar el libro:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLibro(prev => ({
      ...prev,
      [name]: name === 'estado' ? parseInt(value) : value
    }));
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <PrivateRoute>
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">
            <i className="fas fa-edit me-2"></i>
            Editar Libro
          </h2>
          <button 
            className="btn btn-outline-secondary"
            onClick={() => router.push('/libros')}
          >
            <i className="fas fa-arrow-left me-2"></i>
            Volver
          </button>
        </div>

        {showSuccess && (
          <Alert variant="success" className="mb-4" onClose={() => setShowSuccess(false)} dismissible>
            <i className="fas fa-check-circle me-2"></i>
            Libro actualizado correctamente
          </Alert>
        )}

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="titulo" className="form-label">Título*</label>
                  <input
                    type="text"
                    id="titulo"
                    name="titulo"
                    className={`form-control ${errors.titulo ? 'is-invalid' : ''}`}
                    value={libro.titulo}
                    onChange={handleChange}
                  />
                  {errors.titulo && <div className="invalid-feedback">{errors.titulo}</div>}
                </div>

                <div className="col-md-6">
                  <label htmlFor="autor" className="form-label">Autor</label>
                  <input
                    type="text"
                    id="autor"
                    name="autor"
                    className="form-control"
                    value={libro.autor || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="editorial" className="form-label">Editorial</label>
                  <input
                    type="text"
                    id="editorial"
                    name="editorial"
                    className="form-control"
                    value={libro.editorial || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="isbn" className="form-label">ISBN</label>
                  <input
                    type="text"
                    id="isbn"
                    name="isbn"
                    className="form-control"
                    value={libro.isbn || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="subcategoria" className="form-label">Subcategoría</label>
                  <input
                    type="text"
                    id="subcategoria"
                    name="subcategoria"
                    className="form-control"
                    value={libro.subcategoria || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="tipoMaterial" className="form-label">Tipo de Material</label>
                  <input
                    type="text"
                    id="tipoMaterial"
                    name="tipoMaterial"
                    className="form-control"
                    value={libro.tipoMaterial || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <label htmlFor="estado" className="form-label">Estado</label>
                  <select
                    id="estado"
                    name="estado"
                    className="form-select"
                    value={libro.estado}
                    onChange={handleChange}
                  >
                    <option value={0}>Disponible</option>
                    <option value={1}>Prestado</option>
                    <option value={2}>Dañado</option>
                    <option value={3}>Extraviado</option>
                  </select>
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-2"></i>
                      Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
}