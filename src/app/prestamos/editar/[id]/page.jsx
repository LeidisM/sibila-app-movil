'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../components/Api';
import PrivateRoute from '../../../components/PrivateRoute';
import '../../../../app/styles/formStyles.css';
import '../../../../app/styles/style.css';

const EditarPrestamoContent = () => {
  const router = useRouter();
  const { id } = useParams();
  const [prestamo, setPrestamo] = useState({
    id: 0,
    documentoUsuario: '',
    ISBNLibro: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    api.get(`/Prestamos/GetPrestamo/${id}`)
      .then(response => {
        setPrestamo({
          id: response.data.id,
          documentoUsuario: response.data.usuario.documento,
          ISBNLibro: response.data.libro.isbn
        });
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al obtener el préstamo:", error);
        setError("Error al cargar los datos del préstamo.");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPrestamo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!prestamo.documentoUsuario || !prestamo.ISBNLibro) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    api.post('/Prestamos/EditarPrestamo', prestamo)
      .then(response => {
        setShowSuccess(true);
        setTimeout(() => {
          router.push('/prestamos');
        }, 1500);
      })
      .catch(error => {
        console.error("Error al actualizar el préstamo:", error);
        alert("Ocurrió un error al actualizar el préstamo.");
      });
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

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!prestamo) {
    return <div className="alert alert-warning">No se encontraron datos del préstamo</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><i className="fas fa-edit me-2"></i> Editar Préstamo</h2>
        <button 
          className="btn btn-outline-secondary" 
          onClick={() => router.push('/prestamos')}
        >
          <i className="fas fa-arrow-left me-2"></i> Volver
        </button>
      </div>

      {showSuccess && (
        <div className="alert alert-success">✅ Préstamo editado correctamente.</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="documentoUsuario" className="form-label">Documento del Usuario*</label>
          <input
            type="text"
            id="documentoUsuario"
            name="documentoUsuario"
            className="form-control"
            value={prestamo.documentoUsuario || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="ISBNLibro" className="form-label">ISBN del Libro*</label>
          <input
            type="text"
            id="ISBNLibro"
            name="ISBNLibro"
            className="form-control"
            value={prestamo.ISBNLibro || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="d-flex justify-content-end">
          <button 
            type="button" 
            className="btn btn-secondary me-2"
            onClick={() => router.push('/prestamos')}
          >
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            Actualizar Préstamo
          </button>
        </div>
      </form>
    </div>
  );
};

const EditarPrestamo = () => {
  return (
    <PrivateRoute>
      <EditarPrestamoContent />
    </PrivateRoute>
  );
};

export default EditarPrestamo;
