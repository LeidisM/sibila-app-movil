import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import '../styles/tablaResponsive.css';
import '../styles/style.css';

const TablaResponsive = ({ 
  columnas, 
  data, 
  acciones = {}, 
  itemsPerPageDefault = 5, // Cambiado a 5 por defecto para móviles
  uniqueKey = 'id', 
  titulo = 'Lista'
}) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageDefault);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es móvil
  React.useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const term = searchTerm.toLowerCase();
    return data.filter(item =>
      Object.values(item).some(val =>
        val && val.toString().toLowerCase().includes(term)
    )); // Se corrigió aquí el cierre de paréntesis
  }, [searchTerm, data]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Versión móvil: Tarjetas en lugar de tabla
  const MobileView = () => (
    <div className="mobile-cards-container">
      {paginatedData.length > 0 ? paginatedData.map(item => (
        <div key={item[uniqueKey]} className="mobile-card">
          {columnas.map(col => (
            <div key={col.key} className="mobile-card-row">
              <span className="mobile-card-label">{col.label}:</span>
              <span className="mobile-card-value">
                {col.render ? col.render(item[col.key], item) : item[col.key]}
              </span>
            </div>
          ))}
          {(acciones.ver || acciones.editar || acciones.eliminar) && (
            <div className="mobile-card-actions">
              {acciones.custom?.map((action, index) => (
                <button
                  key={index}
                  className={`btn btn-sm ${action.className || 'btn-outline-secondary'} me-1`}
                  onClick={() => action.handler(item[uniqueKey])}
                >
                  {action.icon && <i className={`fas ${action.icon} me-1`}></i>}
                  {isMobile ? action.label : null}
                </button>
              ))}
              {acciones.ver && (
                <button className="btn btn-sm btn-outline-info me-1" onClick={() => acciones.ver(item[uniqueKey])}>
                  <i className="fas fa-eye"></i> Ver
                </button>
              )}
              {acciones.editar && (
                <button className="btn btn-sm btn-outline-warning me-1" onClick={() => acciones.editar(item[uniqueKey])}>
                  <i className="fas fa-edit"></i> Editar
                </button>
              )}
              {acciones.eliminar && (
                <button className="btn btn-sm btn-outline-danger" onClick={() => acciones.eliminar(item[uniqueKey])}>
                  <i className="fas fa-trash"></i> Eliminar
                </button>
              )}
            </div>
          )}
        </div>
      )) : (
        <div className="no-results">No hay resultados</div>
      )}
    </div>
  );

  // Versión desktop: Tabla tradicional
  const DesktopView = () => (
    <div className="table-responsive">
      <table className="table table-hover table-bordered">
        <thead>
          <tr>
            {columnas.map(col => <th key={col.key}>{col.label}</th>)}
            {acciones.ver || acciones.editar || acciones.eliminar ? <th>Acciones</th> : null}
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? paginatedData.map(item => (
            <tr key={item[uniqueKey]}>
              {columnas.map(col => (
                <td key={col.key}>{col.render ? col.render(item[col.key], item) : item[col.key]}</td>
              ))}
              {(acciones.ver || acciones.editar || acciones.eliminar) && (
                <td className="actions-cell">
                  {acciones.ver && (
                    <button className="btn btn-sm btn-outline-info me-1" onClick={() => acciones.ver(item[uniqueKey])}>
                      <i className="fas fa-eye"></i>
                    </button>
                  )}
                  {acciones.editar && (
                    <button className="btn btn-sm btn-outline-warning me-1" onClick={() => acciones.editar(item[uniqueKey])}>
                      <i className="fas fa-edit"></i>
                    </button>
                  )}
                  {acciones.eliminar && (
                    <button className="btn btn-sm btn-outline-danger" onClick={() => acciones.eliminar(item[uniqueKey])}>
                      <i className="fas fa-trash"></i>
                    </button>
                  )}
                </td>
              )}
            </tr>
          )) : (
            <tr>
              <td colSpan={columnas.length + 1} className="text-center">No hay resultados</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="responsive-table-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>{titulo}</h4>
        {acciones?.crear && (
          <button className="btn btn-primary" onClick={acciones.crear}>
            <i className="fas fa-plus me-2"></i>Nuevo
          </button>
        )}
      </div>

      <div className="input-group mb-3">
        <span className="input-group-text"><i className="fas fa-search"></i></span>
        <input
          type="text"
          className="form-control"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        {searchTerm && (
          <button className="btn btn-outline-secondary" onClick={() => setSearchTerm('')}>
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>

      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="items-per-page">
          <span className="me-2">Mostrar:</span>
          <select 
            className="form-select form-select-sm" 
            style={{ width: 'auto' }}
            onChange={(e) => {
              setItemsPerPage(parseInt(e.target.value));
              setCurrentPage(1);
            }}
            value={itemsPerPage}
          >
            {[5, 10, 15].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      {isMobile ? <MobileView /> : <DesktopView />}

      <div className="d-flex justify-content-center mt-3">
        <nav>
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                &laquo;
              </button>
            </li>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <li key={i} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(pageNum)}>
                    {pageNum}
                  </button>
                </li>
              );
            })}
            
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                &raquo;
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default TablaResponsive;