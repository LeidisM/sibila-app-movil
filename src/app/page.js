'use client';

import Image from 'next/image';
//import '../styles/inicio.css';
import '../app/styles/inicio.css';
//import PrivateRoute from '../../app/components/PrivateRoute';
import PrivateRoute from './components/PrivateRoute';

export default function Home() {
  return (
    <PrivateRoute>
      <div className="inicio-container">
        <h1 className="titulo-inicio">Bienvenido a Sibila App</h1>
        <Image 
          src="/inicio.jpg" 
          alt="Imagen de bienvenida" 
          width={800} 
          height={500} 
          className="inicio-imagen" 
        />
      </div>
    </PrivateRoute>
  );
}
