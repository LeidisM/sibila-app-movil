'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../app/components/Api';
import TablaResponsive from '../../app/components/TablaResponsive';
import PrivateRoute from '../../app/components/PrivateRoute';

const PrestamosContent = () => {
  const router = useRouter();
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/Prestamos/GetPrestamos")
      .then(response => {
        console.log("Datos de préstamos recibidos:", response.data); // Para depuración
        setPrestamos(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al obtener los préstamos:", error);
        setLoading(false);
        alert("Ocurrió un error al cargar los préstamos.");
      });
  }, []);

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

  const columnas = [
    { 
      key: 'usuario',
      label: 'Usuario',
      render: (usuario) => `${usuario?.nombre || 'N/A'} ${usuario?.apellido || ''}`.trim()
    },
    { 
      key: 'usuarioDocumento',
      label: 'Documento',
      render: (usuario) => usuario?.documento || 'N/A'
    },
    { 
      key: 'libro',
      label: 'Libro',
      render: (libro) => libro?.titulo || 'N/A'
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

  const acciones = {
    crear: () => router.push('/prestamos/crear'),
    ver: (id) => router.push(`/prestamos/detalle/${id}`),
    editar: (id) => router.push(`/prestamos/editar/${id}`),
    custom: [
      {
        label: 'Devolver',
        icon: 'fa-undo',
        className: 'btn-warning',
        handler: (id) => {
          if (window.confirm("¿Estás seguro de que quieres devolver este préstamo?")) {
            api.post(`/Prestamos/Devolver/${id}`)
              .then(() => {
                setPrestamos(prestamos.filter(prestamo => prestamo.id !== id));
                alert("Préstamo devuelto correctamente.");
              })
              .catch(error => {
                console.error("Error al devolver el préstamo:", error);
                alert("Ocurrió un error al devolver el préstamo.");
              });
          }
        }
      }
    ]
  };

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status" /></div>;
  }

  // Transformamos los datos para que coincidan con la estructura esperada por las columnas
  const datosTransformados = prestamos.map(prestamo => ({
    ...prestamo,
    usuario: prestamo.usuario,
    libro: prestamo.libro,
    fechaPrestamo: prestamo.fechaPrestamo,
    fechaDevolucion: prestamo.fechaDevolucion
  }));

  return (
    <TablaResponsive 
      columnas={columnas} 
      data={datosTransformados} 
      acciones={acciones}
      titulo="Lista de Préstamos"
      itemsPerPageDefault={10}
    />
  );
};

export default function Prestamos() {
  return (
    <PrivateRoute>
      <PrestamosContent />
    </PrivateRoute>
  );
}