// components/TablaResponsive.js
import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation'; 

const TablaResponsive = ({ 
  columnas, 
  data, 
  acciones = {}, 
  itemsPerPageDefault = 10, 
  uniqueKey = 'id', 
  titulo = 'Lista'
}) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageDefault);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const term = searchTerm.toLowerCase();
    return data.filter(item =>
      Object.values(item).some(val =>
        val && val.toString().toLowerCase().includes(term)
      )
    );
  }, [searchTerm, data]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  return (
    <div className="container-fluid p-3">
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

      <div className="d-flex justify-content-end mb-2">
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
                  <td>
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

      <div className="d-flex justify-content-center mt-3">
        <nav>
          <ul className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default TablaResponsive;
