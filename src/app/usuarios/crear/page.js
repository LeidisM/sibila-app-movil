'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Alert } from 'react-bootstrap';
import api from '../../../app/components/Api';
import PrivateRoute from '../../components/PrivateRoute';
import '../../../app/styles/formStyles.css';

const CrearUsuarioContent = () => {
  const router = useRouter();

  const [usuario, setUsuario] = useState({
    nombre: '',
    apellido: '',
    tipoDocumento: '',
    documento: '',
    correoElectronico: '',
    contrasena: '',
    rolId: ''
  });

  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Cargar roles desde la API
  useEffect(() => {
    api.get('/Roles')
      .then(response => setRoles(response.data))
      .catch(error => console.error("Error al cargar roles", error));
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!usuario.nombre) newErrors.nombre = 'Nombre requerido';
    if (!usuario.apellido) newErrors.apellido = 'Apellido requerido';
    if (!usuario.tipoDocumento) newErrors.tipoDocumento = 'Tipo de documento requerido';
    if (!usuario.documento) newErrors.documento = 'Documento requerido';
    if (!usuario.correoElectronico) newErrors.correoElectronico = 'Correo requerido';
    if (!usuario.contrasena) newErrors.contrasena = 'Contraseña requerida';
    if (!usuario.rolId) newErrors.rolId = 'Rol requerido';
    
    // Validación adicional de email
    if (usuario.correoElectronico && !/^\S+@\S+\.\S+$/.test(usuario.correoElectronico)) {
      newErrors.correoElectronico = 'Correo electrónico inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await api.post('/Usuarios', usuario);
      setShowSuccess(true);
      setUsuario({
        nombre: '',
        apellido: '',
        tipoDocumento: '',
        documento: '',
        correoElectronico: '',
        contrasena: '',
        rolId: ''
      });

      setTimeout(() => {
        setShowSuccess(false);
        router.push('/usuarios');
      }, 2000);
    } catch (error) {
      console.error("Error al crear usuario:", error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario(prev => ({
      ...prev,
      [name]: name === 'tipoDocumento' || name === 'rolId' ? parseInt(value) : value
    }));
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><i className="fas fa-user-plus me-2"></i> Crear Usuario</h2>
        <Button variant="outline-secondary" onClick={() => router.push('/usuarios')}>
          <i className="fas fa-arrow-left me-2"></i> Volver a la lista
        </Button>
      </div>

      {showSuccess && (
        <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
          ✅ Usuario creado correctamente.
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            name="nombre"
            className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
            value={usuario.nombre}
            onChange={handleChange}
          />
          {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="apellido">Apellido</label>
          <input
            id="apellido"
            name="apellido"
            className={`form-control ${errors.apellido ? 'is-invalid' : ''}`}
            value={usuario.apellido}
            onChange={handleChange}
          />
          {errors.apellido && <div className="invalid-feedback">{errors.apellido}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="tipoDocumento">Tipo de Documento</label>
          <select
            id="tipoDocumento"
            name="tipoDocumento"
            className={`form-select ${errors.tipoDocumento ? 'is-invalid' : ''}`}
            value={usuario.tipoDocumento}
            onChange={handleChange}
          >
            <option value="">Seleccione</option>
            <option value="1">Cédula de Ciudadanía</option>
            <option value="2">Tarjeta de Identidad</option>
            <option value="3">Cédula de Extranjería</option>
          </select>
          {errors.tipoDocumento && <div className="invalid-feedback">{errors.tipoDocumento}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="documento">Documento</label>
          <input
            id="documento"
            name="documento"
            className={`form-control ${errors.documento ? 'is-invalid' : ''}`}
            value={usuario.documento}
            onChange={handleChange}
          />
          {errors.documento && <div className="invalid-feedback">{errors.documento}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="correoElectronico">Correo Electrónico</label>
          <input
            type="email"
            id="correoElectronico"
            name="correoElectronico"
            className={`form-control ${errors.correoElectronico ? 'is-invalid' : ''}`}
            value={usuario.correoElectronico}
            onChange={handleChange}
          />
          {errors.correoElectronico && <div className="invalid-feedback">{errors.correoElectronico}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="contrasena">Contraseña</label>
          <input
            type="password"
            id="contrasena"
            name="contrasena"
            className={`form-control ${errors.contrasena ? 'is-invalid' : ''}`}
            value={usuario.contrasena}
            onChange={handleChange}
          />
          {errors.contrasena && <div className="invalid-feedback">{errors.contrasena}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="rolId">Rol</label>
          <select
            id="rolId"
            name="rolId"
            className={`form-select ${errors.rolId ? 'is-invalid' : ''}`}
            value={usuario.rolId}
            onChange={handleChange}
          >
            <option value="">Seleccione un rol</option>
            {roles.map((rol) => (
              <option key={rol.id} value={rol.id}>{rol.nombre}</option>
            ))}
          </select>
          {errors.rolId && <div className="invalid-feedback">{errors.rolId}</div>}
        </div>

        <div className="d-flex justify-content-center">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Guardando...
              </>
            ) : 'Guardar Usuario'}
          </Button>
        </div>
      </form>
    </div>
  );
};

const CrearUsuario = () => {
  return (
    <PrivateRoute>
      <CrearUsuarioContent />
    </PrivateRoute>
  );
};

export default CrearUsuario;