'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Alert } from 'react-bootstrap';
import api from '../../../app/components/Api';
import PrivateRoute from '../../components/PrivateRoute';
import '../../../app/styles/formStyles.css';

const CrearLibroContent = () => {
  const router = useRouter();

  const [libro, setLibro] = useState({
    titulo: '',
    autor: '',
    editorial: '',
    isbn: '',
    subcategoria: '',
    tipoMaterial: '',
    estado: 0
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!libro.titulo) newErrors.titulo = 'Título requerido';
    if (!libro.autor) newErrors.autor = 'Autor requerido';
    if (!libro.isbn) newErrors.isbn = 'ISBN requerido';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await api.post('/Libros', libro);
      setShowSuccess(true);
      setLibro({
        titulo: '',
        autor: '',
        editorial: '',
        isbn: '',
        subcategoria: '',
        tipoMaterial: '',
        estado: 0
      });

      setTimeout(() => {
        setShowSuccess(false);
        router.push('/libros');
      }, 2000);
    } catch (error) {
      console.error("Error al crear libro:", error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
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

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><i className="fas fa-book me-2"></i> Crear Libro</h2>
        <Button variant="outline-secondary" onClick={() => router.push('/libros')}>
          <i className="fas fa-arrow-left me-2"></i> Volver a la lista
        </Button>
      </div>

      {showSuccess && (
        <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
          ✅ Libro creado correctamente.
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="titulo">Título*</label>
          <input
            id="titulo"
            name="titulo"
            className={`form-control ${errors.titulo ? 'is-invalid' : ''}`}
            value={libro.titulo}
            onChange={handleChange}
          />
          {errors.titulo && <div className="invalid-feedback">{errors.titulo}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="autor">Autor*</label>
          <input
            id="autor"
            name="autor"
            className={`form-control ${errors.autor ? 'is-invalid' : ''}`}
            value={libro.autor}
            onChange={handleChange}
          />
          {errors.autor && <div className="invalid-feedback">{errors.autor}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="editorial">Editorial</label>
          <input
            id="editorial"
            name="editorial"
            className="form-control"
            value={libro.editorial}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="isbn">ISBN*</label>
          <input
            id="isbn"
            name="isbn"
            className={`form-control ${errors.isbn ? 'is-invalid' : ''}`}
            value={libro.isbn}
            onChange={handleChange}
          />
          {errors.isbn && <div className="invalid-feedback">{errors.isbn}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="subcategoria">Subcategoría</label>
          <input
            id="subcategoria"
            name="subcategoria"
            className="form-control"
            value={libro.subcategoria}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="tipoMaterial">Tipo de Material</label>
          <input
            id="tipoMaterial"
            name="tipoMaterial"
            className="form-control"
            value={libro.tipoMaterial}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="estado">Estado</label>
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

        <div className="d-flex justify-content-end">
          <Button type="submit"  disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Guardando...
              </>
            ) : 'Guardar Libro'}
          </Button>
        </div>
      </form>
    </div>
  );
};

const CrearLibro = () => {
  return (
    <PrivateRoute>
      <CrearLibroContent />
    </PrivateRoute>
  );
};

export default CrearLibro;