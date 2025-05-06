'use client';

import React from 'react';
import GenericDetail from '../../../components/GenericDetail';

const DetalleLibro = ({ params }) => {
  const fields = [
    { key: 'titulo', label: 'Título' },
    { key: 'autor', label: 'Autor' },
    { key: 'editorial', label: 'Editorial' },
    { key: 'isbn', label: 'ISBN' },
    { key: 'subcategoria', label: 'Subcategoría' },
    { key: 'tipoMaterial', label: 'Tipo de Material' }
  ];

  return (
    <GenericDetail
      title="Información del Libro"
      endpoint="/Libros"
      backRoute="/libros"
      fields={fields}
      params={params}
      badgeColor="#6bbf3d"
      icon="fa-book"
    />
  );
};

export default DetalleLibro;