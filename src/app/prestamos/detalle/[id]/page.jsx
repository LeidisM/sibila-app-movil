'use client';

import React from 'react';
import GenericDetail from '../../../components/GenericDetail';

const formatDate = (dateString) => {
  if (!dateString) return 'Pendiente';
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Fecha inválida' : date.toLocaleDateString();
  } catch (error) {
    console.error("Error al formatear fecha:", error);
    return 'Formato inválido';
  }
};

const DetallePrestamo = ({ params }) => {
  const fields = [
    { 
      key: 'fechaPrestamo',
      label: 'Fecha Préstamo',
      render: (value) => formatDate(value)
    },
    { 
      key: 'libroTitulo',
      label: 'Título',
      render: (_, data) => data.libro?.titulo || 'N/A'
    },
    { 
      key: 'libroAutor',
      label: 'Autor',
      render: (_, data) => data.libro?.autor || 'N/A'
    },
    { 
      key: 'usuarioDocumento',
      label: 'Documento',
      render: (_, data) => data.usuario?.documento || 'N/A'
    },
    { 
      key: 'usuarioNombre',
      label: 'Nombre',
      render: (_, data) => data.usuario?.nombre || 'N/A'
    },
    { 
      key: 'usuarioApellido',
      label: 'Apellido',
      render: (_, data) => data.usuario?.apellido || 'N/A'
    }
  ];

  return (
    <GenericDetail
      title="Información del Préstamo"
      endpoint="/Prestamos/GetPrestamo"
      backRoute="/prestamos"
      fields={fields}
      params={params}
      badgeColor="#6bbf3d"
      icon="fa-book-open"
    />
  );
};

export default DetallePrestamo;