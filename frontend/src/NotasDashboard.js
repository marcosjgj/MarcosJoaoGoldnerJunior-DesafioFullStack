import React, { useState, useEffect, useCallback } from 'react';
import './Style.css';
import chevronDir from './imgs/chevron-dir.svg';
import doubleArrowDir from './imgs/double-arrow-dir.svg';
import chevronEsq from './imgs/chevron-esq.svg';
import doubleArrowEsq from './imgs/double-arrow-esq.svg';
import filter from './imgs/filter.svg';

function NotasDashboard() {
  const [notes, setNotes] = useState([]);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({ site: '', equipment: '', startDate: '', endDate: '' });
  const emptyNote = { site: '', equipment: '', variable: '', author: '', message: '' };
  const [newNote, setNewNote] = useState(emptyNote);
  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const limit = 5;

  const fetchNotes = useCallback(async () => {
    try {
      const queryParams = { ...filters, page, limit };
      const queryString = new URLSearchParams(
        Object.fromEntries(Object.entries(queryParams).filter(([_, v]) => v))
      ).toString();

      const response = await fetch(`http://127.0.0.1:8000/api/v1/notes?${queryString}`);
      const data = await response.json();

      setNotes(data.items || []);
      setTotalRecords(data.total || 0);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const totalPages = Math.ceil(totalRecords / limit);

  const handleSaveNote = async (e) => {
    e.preventDefault();

    // Validação manual robusta
    const newErrors = {};
    if (!newNote.site) newErrors.site = "O site é obrigatório";
    if (!newNote.equipment) newErrors.equipment = "O equipamento é obrigatório";
    if (!newNote.variable) newErrors.variable = "A variável é obrigatória";
    if (!newNote.author) newErrors.author = "O autor é obrigatório";
    if (!newNote.message) newErrors.message = "A mensagem é obrigatória";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const isUpdate = !!newNote.id;
    const url = isUpdate
      ? `http://127.0.0.1:8000/api/v1/notes/${newNote.id}`
      : 'http://127.0.0.1:8000/api/v1/notes';

    try {
      const response = await fetch(url, {
        method: isUpdate ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newNote, timestamp: new Date().toISOString() })
      });

      if (response.ok) {
        setIsModalOpen(false);
        setNewNote(emptyNote);
        fetchNotes();
      }
    } catch (error) {
      alert("Erro ao salvar a nota.");
    }
  };

  const handleDelete = async () => {
    if (!newNote.id) return;
    if (window.confirm("Certeza que quer apagar essa nota?")) {
      try {
        await fetch(`http://127.0.0.1:8000/api/v1/notes/${newNote.id}`, { method: 'DELETE' });
        setIsModalOpen(false);
        setNewNote(emptyNote);
        fetchNotes();
      } catch (error) {
        alert("Erro ao deletar.");
      }
    }
  };

  return (
    <>
      <header className="header">
        <h2>Notas</h2>
      </header>

      <section className="filter-bar">

        <div className="filter-group">
          <input className="input-field" style={{ width: '350px' }} placeholder="Filtrar por Site" value={filters.site} onChange={e => { setFilters({ ...filters, site: e.target.value }); setPage(1); }} />
          <input className="input-field" style={{ width: '350px' }} placeholder="Filtrar por Equipamento" value={filters.equipment} onChange={e => { setFilters({ ...filters, equipment: e.target.value }); setPage(1); }} />
        </div>

        {/* Texto cinza pequeno que aparece apenas quando há filtro */}
        {filters.startDate && filters.endDate && (
          <span className="periodo-selecionado">
            Período:<br />
            {filters.startDate.split('-').reverse().join('/')} até {filters.endDate.split('-').reverse().join('/')}
          </span>
        )}

        <div className="filtro-periodo-container">
          <div className="filtro-periodo-container">
            {/* Agrupador para alinhar o texto abaixo do botão */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <button
                className="btn-periodo"
                onClick={() => setShowDatePicker(!showDatePicker)}
              >
                <img src={filter} alt="Filtro" style={{ marginRight: '10px', height: '16px' }} />
                Filtrar por período
              </button>

            </div>
          </div>

          {showDatePicker && (
            <div className="dropdown-data">
              <div className="data-group">
                <button onClick={() => setShowDatePicker(!showDatePicker)} className="close-btn">✕</button>
                <label>Data Inicial</label>
                <input
                  type="date"
                  className="input-field"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                />
              </div>
              <div className="data-group">
                <label>Data Final</label>
                <input
                  type="date"
                  className="input-field"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                />
              </div>
              <button
                className="btn-limpar-data"
                onClick={() => {
                  setFilters({ ...filters, startDate: '', endDate: '' }); // Reseta as datas
                  setPage(1); // Volta para a primeira página
                  setShowDatePicker(false); // Fecha o dropdown
                }}
              >Limpar Filtro
              </button>
            </div>
          )}
        </div>
      </section>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{newNote.id ? 'Editar Nota' : 'Nova Nota'}</h3>
              <button onClick={() => { setIsModalOpen(false); setErrors({}); }} className="close-btn">✕</button>
            </div>

            <form onSubmit={handleSaveNote} className="form-grid" noValidate>

              <div className="input-container">
                <input
                  className={`input-field ${errors.site ? 'error' : ''}`}
                  placeholder="Site"
                  value={newNote.site}
                  onChange={(e) => {
                    setNewNote({ ...newNote, site: e.target.value });
                    if (errors.site) setErrors({ ...errors, site: null });
                  }}
                />
                {newNote.site && <button type="button" className="clear-button" onClick={() => setNewNote({ ...newNote, site: '' })}>✕</button>}
                {errors.site && <span className="error-message">{errors.site}</span>}
              </div>

              <div className="input-container">
                <input
                  className={`input-field ${errors.equipment ? 'error' : ''}`}
                  placeholder="Equipamento"
                  value={newNote.equipment}
                  onChange={e => {
                    setNewNote({ ...newNote, equipment: e.target.value });
                    if (errors.equipment) setErrors({ ...errors, equipment: null });
                  }}
                />
                {newNote.equipment && <button type="button" className="clear-button" onClick={() => setNewNote({ ...newNote, equipment: '' })}>✕</button>}
                {errors.equipment && <span className="error-message">{errors.equipment}</span>}
              </div>

              <div className="input-container">
                <input
                  className={`input-field ${errors.variable ? 'error' : ''}`}
                  placeholder="Variável"
                  value={newNote.variable}
                  onChange={e => {
                    setNewNote({ ...newNote, variable: e.target.value });
                    if (errors.variable) setErrors({ ...errors, variable: null });
                  }}
                />
                {newNote.variable && <button type="button" className="clear-button" onClick={() => setNewNote({ ...newNote, variable: '' })}>✕</button>}
                {errors.variable && <span className="error-message">{errors.variable}</span>}
              </div>

              <div className="input-container">
                <input
                  className={`input-field ${errors.author ? 'error' : ''}`}
                  placeholder="Autor"
                  value={newNote.author}
                  onChange={e => {
                    setNewNote({ ...newNote, author: e.target.value });
                    if (errors.author) setErrors({ ...errors, author: null });
                  }}
                />
                {newNote.author && <button type="button" className="clear-button" onClick={() => setNewNote({ ...newNote, author: '' })}>✕</button>}
                {errors.author && <span className="error-message">{errors.author}</span>}
              </div>

              <div className="input-container full-width">
                <textarea
                  className={`input-field ${errors.message ? 'error' : ''}`}
                  style={{ minHeight: '100px' }}
                  placeholder="Mensagem"
                  value={newNote.message}
                  onChange={e => {
                    setNewNote({ ...newNote, message: e.target.value })
                    if (errors.message) setErrors({ ...errors, message: null });
                  }}
                />
                {errors.message && <span className="error-message">{errors.message}</span>}
              </div>

              <div className="modal-actions">
                <button type="submit" className="modal-btn-salvar">
                  {newNote.id ? 'Salvar Alterações' : 'Salvar Nota'}
                </button>
                {newNote.id && (
                  <button type="button" onClick={handleDelete} className="modal-btn-delete">Deletar</button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Site</th>
              <th>Equipamento</th>
              <th>Variável</th>
              <th>Data</th>
              <th>Autor</th>
              <th style={{ maxWidth: '300px' }}>Mensagem</th>
            </tr>
          </thead>
          <tbody>
            {notes.length > 0 ? notes.map(note => (
              <tr key={note.id} className="clickable-row" onClick={() => { setNewNote(note); setIsModalOpen(true); setErrors({}); }}>
                <td>{note.site}</td><td>{note.equipment}</td><td>{note.variable}</td>
                <td>{new Date(note.timestamp).toLocaleDateString()}</td><td>{note.author}</td>
                <td className="truncate-text">{note.message}</td>
              </tr>
            )) : (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Nenhum registro encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button className="btn-nova-nota" onClick={() => { setNewNote(emptyNote); setIsModalOpen(true); setErrors({}); }}>
          + Nova Nota
        </button>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="page-btn nav-btn" disabled={page === 1} onClick={() => setPage(1)}><img src={doubleArrowEsq} style={{ height: '13px' }} alt="Primeiro" /></button>
          <button className="page-btn nav-btn" disabled={page === 1} onClick={() => setPage(page - 1)}><img src={chevronEsq} style={{ height: '13px' }} alt="Anterior" /></button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(pageNum => pageNum >= page - 2 && pageNum <= page + 2)
            .map((pageNum) => (
              <button
                key={pageNum}
                className={`page-btn ${page === pageNum ? 'active' : ''}`}
                onClick={() => setPage(pageNum)}
              >
                {pageNum}
              </button>
            ))
          }

          <button className="page-btn nav-btn" disabled={page === totalPages || totalPages === 0} onClick={() => setPage(page + 1)}><img src={chevronDir} style={{ height: '13px' }} alt="Próximo" /></button>
          <button className="page-btn nav-btn" disabled={page === totalPages || totalPages === 0} onClick={() => setPage(totalPages)}><img src={doubleArrowDir} style={{ height: '13px' }} alt="Último" /></button>
        </div>
      </div>
    </>
  );
}

export default NotasDashboard;