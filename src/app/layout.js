'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '../app/contexts/AuthContext';
import '../app/styles/layout.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Menu({ children }) {  // Añade children como prop
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    setMenuOpen(false);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, [pathname]);

  const handleLogout = () => {
    logout(() => router.push('/login'));
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="layout-wrapper">
      {menuOpen && isMobile && (
        <div 
          className="menu-overlay" 
          onClick={toggleMenu}
        />
      )}
      
      <aside className={`sidebar ${menuOpen ? 'open' : ''} ${isMobile ? 'mobile' : ''}`}>
        <div className="sidebar-header">
          <h2>Sibila App</h2>
          <button 
            className="menu-toggle" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
        <nav className="sidebar-nav">
          <Link href="/" className={`sidebar-link ${pathname === '/' ? 'active' : ''}`} onClick={isMobile ? toggleMenu : undefined}>🏠 Inicio</Link>
          <Link href="/usuarios" className={`sidebar-link ${pathname.startsWith('/usuarios') ? 'active' : ''}`} onClick={isMobile ? toggleMenu : undefined}>👥 Usuarios</Link>
          <Link href="/libros" className={`sidebar-link ${pathname.startsWith('/libros') ? 'active' : ''}`} onClick={isMobile ? toggleMenu : undefined}>📚 Libros</Link>
          <Link href="/prestamos" className={`sidebar-link ${pathname.startsWith('/prestamos') ? 'active' : ''}`} onClick={isMobile ? toggleMenu : undefined}>🔁 Préstamos</Link>
          <Link href="/devoluciones" className={`sidebar-link ${pathname.startsWith('/devoluciones') ? 'active' : ''}`} onClick={isMobile ? toggleMenu : undefined}>↩️ Devoluciones</Link>
        </nav>
        {user && (
          <div className="logout-container">
            <button onClick={handleLogout} className="logout-btn">
              🔒 Cerrar Sesión
            </button>
          </div>
        )}
      </aside>
      
      <main className="main-content">
        {isMobile && (
          <button 
            className="floating-menu-button"
            onClick={toggleMenu}
            aria-label="Open menu"
          >
            ☰
          </button>
        )}
        <div className="content-container">{children}</div>
      </main>
    </div>
  );
}

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAuthRoute = ['/login', '/registro'].includes(pathname);

  return (
    <html lang="es">
      <body>
        <AuthProvider>
          {isAuthRoute ? (
            children
          ) : (
            <Menu>{children}</Menu>
          )}
        </AuthProvider>
      </body>
    </html>
  );
}