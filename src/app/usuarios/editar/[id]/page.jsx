'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../components/Api';
import PrivateRoute from '../../../components/PrivateRoute';
import '../../../../app/styles/formStyles.css';
import '../../../../app/styles/style.css';

const EditarUsuarioContent = () => {
  const router = useRouter();
  const { id } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Cargar datos del usuario
    api.get(`/Usuarios/${id}`)
      .then(response => {
        setUsuario(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al obtener el usuario:", error);
        setError("Error al cargar los datos del usuario.");
        setLoading(false);
      });

    // Cargar los roles disponibles
    api.get("/Roles")
      .then(response => {
        setRoles(response.data);
      })
      .catch(error => {
        console.error("Error al cargar los roles:", error);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar datos antes de enviar
    if (!usuario.nombre || !usuario.apellido || !usuario.correoElectronico || 
        !usuario.tipoDocumento || !usuario.documento || !usuario.rolId) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    api.put(`/Usuarios/${id}`, usuario)
      .then(response => {
        alert("Usuario actualizado correctamente.");
        router.push('/usuarios');
      })
      .catch(error => {
        console.error("Error al actualizar el usuario:", error);
        alert("Ocurrió un error al actualizar el usuario.");
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario(prev => ({
      ...prev,
      [name]: name === 'tipoDocumento' || name === 'rolId' ? parseInt(value) : value
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

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!usuario) {
    return <div className="alert alert-warning">No se encontraron datos del usuario</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><i className="fas fa-edit me-2"></i> Editar Usuario</h2>
        <button 
          className="btn btn-outline-secondary" 
          onClick={() => router.push('/usuarios')}
        >
          <i className="fas fa-arrow-left me-2"></i> Volver
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre*</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            className="form-control"
            value={usuario.nombre || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="apellido" className="form-label">Apellido*</label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            className="form-control"
            value={usuario.apellido || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="correoElectronico" className="form-label">Correo Electrónico*</label>
          <input
            type="email"
            id="correoElectronico"
            name="correoElectronico"
            className="form-control"
            value={usuario.correoElectronico || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="tipoDocumento" className="form-label">Tipo de Documento*</label>
          <select
            id="tipoDocumento"
            name="tipoDocumento"
            className="form-select"
            value={usuario.tipoDocumento || ''}
            onChange={handleChange}
            required
          >
            <option value="1">Cédula de Ciudadanía</option>
            <option value="2">Tarjeta de Identidad</option>
            <option value="3">Cédula de Extranjería</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="documento" className="form-label">Documento*</label>
          <input
            type="text"
            id="documento"
            name="documento"
            className="form-control"
            value={usuario.documento || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="rolId" className="form-label">Rol*</label>
          <select
            id="rolId"
            name="rolId"
            className="form-select"
            value={usuario.rolId || ''}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar rol</option>
            {roles.map((rol) => (
              <option key={rol.id} value={rol.id}>{rol.nombre}</option>
            ))}
          </select>
        </div>

        <div className="d-flex justify-content-end">
          <button 
            type="button" 
            className="btn btn-secondary me-2"
            onClick={() => router.push('/usuarios')}
          >
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            Actualizar Usuario
          </button>
        </div>
      </form>
    </div>
  );
};

const EditarUsuario = () => {
  return (
    <PrivateRoute>
      <EditarUsuarioContent />
    </PrivateRoute>
  );
};

export default EditarUsuario;