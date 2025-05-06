'use client';

import React from 'react';
import GenericDetail from '../../../components/GenericDetail';

const tipoDocumentoTexto = {
  1: 'Cédula de Ciudadanía',
  2: 'Tarjeta de Identidad',
  3: 'Cédula de Extranjería'
};

const DetalleUsuario = ({ params }) => {
  const fields = [
    {
      key: 'nombre',
      label: 'Nombre',
      render: (value, data) => `${value} ${data.apellido || ''}`.trim()
    },
    {
      key: 'tipoDocumento',
      label: 'Tipo de Documento',
      render: (value) => tipoDocumentoTexto[value] || 'Desconocido'
    },
    {
      key: 'documento',
      label: 'Número de Documento'
    },
    {
      key: 'correoElectronico',
      label: 'Correo Electrónico',
      type: 'email'
    }
  ];

  const badgeField = {
    key: 'rol',
    label: 'Rol',
    render: (value) => value?.nombre || 'Sin rol'
  };

  return (
    <GenericDetail
      title="Información Usuario"
      endpoint="/Usuarios"
      backRoute="/usuarios"
      fields={fields}
      params={params}  // Pasamos params completo
      badgeField={{
        key: 'rol',
        label: 'Rol',
        render: (value) => value?.nombre || 'Sin rol'
      }}
      icon="fa-user-circle"
    />
  );
};

export default DetalleUsuario;