'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../app/components/Api';
import TablaResponsive from '../../app/components/TablaResponsive';
import PrivateRoute from '../../app/components/PrivateRoute';

const UsuariosContent = () => {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const tipoDocumentoTexto = {
    1: 'Cédula de Ciudadanía',
    2: 'Tarjeta de Identidad',
    3: 'Cédula de Extranjería'
  };

  useEffect(() => {
    api.get("/Usuarios")
      .then(response => {
        setUsuarios(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al obtener los usuarios:", error);
        setLoading(false);
        alert("Ocurrió un error al cargar los usuarios.");
      });
  }, []);

  const columnas = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'apellido', label: 'Apellido' },
    { key: 'rol', label: 'Rol', render: (val) => val?.nombre || 'Sin rol' },
    { key: 'tipoDocumento', label: 'Tipo Documento', render: (val) => tipoDocumentoTexto[val] || 'Desconocido' },
    { key: 'documento', label: 'Documento' },
    { key: 'correoElectronico', label: 'Correo Electrónico' }
  ];

  const acciones = {
    crear: () => router.push('/usuarios/crear'),
    ver: (id) => router.push(`/usuarios/detalle/${id}`),
    editar: (id) => router.push(`/usuarios/editar/${id}`),
    eliminar: (id) => {
      if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
        api.delete(`/Usuarios/${id}`)
          .then(() => {
            setUsuarios(usuarios.filter(usuario => usuario.id !== id));
          })
          .catch(error => {
            console.error("Error al eliminar el usuario:", error);
            alert("Ocurrió un error al eliminar el usuario.");
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
      data={usuarios} 
      acciones={acciones}
      titulo="Lista de Usuarios"
      itemsPerPageDefault={10}
    />
  );
};

export default function Usuarios() {
  return (
    <PrivateRoute>
      <UsuariosContent />
    </PrivateRoute>
  );
}