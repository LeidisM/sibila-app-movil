'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Alert } from 'react-bootstrap';
import api from '../../../app/components/Api';
import PrivateRoute from '../../components/PrivateRoute';
import '../../../app/styles/formStyles.css';

const CrearPrestamoContent = () => {
  const router = useRouter();

  const [prestamo, setPrestamo] = useState({
    documentoUsuario: '',
    ISBNLibro: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!prestamo.documentoUsuario) newErrors.documentoUsuario = 'Documento de usuario requerido';
    if (!prestamo.ISBNLibro) newErrors.ISBNLibro = 'ISBN del libro requerido';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await api.post('/Prestamos/CrearPrestamo', prestamo);
      setShowSuccess(true);
      setPrestamo({
        documentoUsuario: '',
        ISBNLibro: ''
      });

      setTimeout(() => {
        setShowSuccess(false);
        router.push('/prestamos');
      }, 2000);
    } catch (error) {
      console.error("Error al crear préstamo:", error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPrestamo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><i className="fas fa-exchange-alt me-2"></i> Crear Préstamo</h2>
        <Button variant="outline-secondary" onClick={() => router.push('/prestamos')}>
          <i className="fas fa-arrow-left me-2"></i> Volver a la lista
        </Button>
      </div>

      {showSuccess && (
        <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
          ✅ Préstamo creado correctamente.
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="documentoUsuario">Documento del Usuario*</label>
          <input
            id="documentoUsuario"
            name="documentoUsuario"
            className={`form-control ${errors.documentoUsuario ? 'is-invalid' : ''}`}
            value={prestamo.documentoUsuario}
            onChange={handleChange}
          />
          {errors.documentoUsuario && <div className="invalid-feedback">{errors.documentoUsuario}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="ISBNLibro">ISBN del Libro*</label>
          <input
            id="ISBNLibro"
            name="ISBNLibro"
            className={`form-control ${errors.ISBNLibro ? 'is-invalid' : ''}`}
            value={prestamo.ISBNLibro}
            onChange={handleChange}
          />
          {errors.ISBNLibro && <div className="invalid-feedback">{errors.ISBNLibro}</div>}
        </div>

        <div className="d-flex justify-content-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Guardando...
              </>
            ) : 'Crear Préstamo'}
          </Button>
        </div>
      </form>
    </div>
  );
};

const CrearPrestamo = () => {
  return (
    <PrivateRoute>
      <CrearPrestamoContent />
    </PrivateRoute>
  );
};

export default CrearPrestamo;