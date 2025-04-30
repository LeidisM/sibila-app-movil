'use client';

import React, { useEffect, useState } from 'react';
import api from '../../app/components/Api';
import TablaResponsive from '../../app/components/TablaResponsive';
import PrivateRoute from '../../app/components/PrivateRoute';

const DevolucionesContent = () => {
    const [devoluciones, setDevoluciones] = useState([]);
    const [loading, setLoading] = useState(true);


  useEffect(() => {
    api.get("/Prestamos/GetDevoluciones")
      .then(response => {
        setDevoluciones(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al obtener las devoluciones:", error);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Fecha inválida' : date.toLocaleDateString();
    } catch (error) {
      console.error("Error al formatear fecha:", error);
      return 'Formato inválido';
    }
  };

  const columnas = [
    { 
      key: 'usuarioNombre',
      label: 'Usuario',
      render: (_valor, item) => item.usuario?.nombre || 'N/A'
    },
    { 
      key: 'usuarioApellido',
      label: 'Apellido',
      render: (_valor, item) => item.usuario?.apellido || 'N/A'
    },
    { 
      key: 'usuarioDocumento',
      label: 'Documento',
      render: (_valor, item) => item.usuario?.documento || 'N/A'
    },
    { 
      key: 'libroTitulo',
      label: 'Libro',
      render: (_valor, item) => item.libro?.titulo || 'N/A'
    },
    { 
      key: 'libroAutor',
      label: 'Autor',
      render: (_valor, item) => item.libro?.autor || 'N/A'
    },
    { 
      key: 'fechaPrestamo',
      label: 'Fecha Préstamo',
      render: (fecha) => formatDate(fecha)
    },
    { 
      key: 'fechaDevolucion',
      label: 'Fecha Devolución',
      render: (fecha) => formatDate(fecha)
    }
  ];



  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status" /></div>;
  }

  // Transformamos los datos para que coincidan con la estructura esperada por las columnas
  const datosTransformados = devoluciones.map(devolucion => ({
    ...devolucion,
    usuario: devolucion.usuario,
    libro: devolucion.libro,
    fechaPrestamo: devolucion.fechaPrestamo,
    fechaDevolucion: devolucion.fechaDevolucion
  }));

  return (
      <TablaResponsive
        columnas={columnas} 
        data={datosTransformados} 
        titulo="Lista de Devoluciones"
        itemsPerPageDefault={10}
      />      
  );
};

export default function Devoluciones() {
  return (
    <PrivateRoute>
      <DevolucionesContent />
    </PrivateRoute>
  );
}