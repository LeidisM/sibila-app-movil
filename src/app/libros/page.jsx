'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../app/components/Api';
import TablaResponsive from '../../app/components/TablaResponsive';
import PrivateRoute from '../../app/components/PrivateRoute';

const LibrosContent = () => {
  const router = useRouter();
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);

  const estadoTexto = {
    0: 'Disponible',
    1: 'Prestado',
    2: 'Dañado',
    3: 'Extraviado'
  };

  useEffect(() => {
    api.get("/Libros")
      .then(response => {
        setLibros(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al obtener los libros:", error);
        setLoading(false);
        alert("Ocurrió un error al cargar los libros.");
      });
  }, []);

  const columnas = [
    { key: 'titulo', label: 'Título' },
    { key: 'autor', label: 'Autor' },
    { key: 'editorial', label: 'Editorial' },
    { key: 'isbn', label: 'ISBN' },
    { key: 'subcategoria', label: 'Subcategoría' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'estado', label: 'Estado', render: (val) => estadoTexto[val] ?? 'Desconocido' }
  ];

  const acciones = {
    crear: () => router.push('/libros/crear'),
    ver: (id) => router.push(`/libros/detalle/${id}`),
    editar: (id) => router.push(`/libros/editar/${id}`),
    eliminar: (id) => {
      if (window.confirm("¿Eliminar libro?")) {
        api.delete(`/Libros/${id}`).then(() => {
          setLibros(libros.filter(l => l.id !== id));
        });
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status" /></div>;
  }

  return (
    <TablaResponsive 
      columnas={columnas} 
      data={libros} 
      acciones={acciones}
      titulo="Lista de Libros"
    />
  );
};

export default function Libros() {
  return (
    <PrivateRoute>
      <LibrosContent />
    </PrivateRoute>
  );
}
