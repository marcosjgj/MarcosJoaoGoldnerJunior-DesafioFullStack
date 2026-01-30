import React, { useState, useEffect, useCallback } from 'react';
import './Style.css';
import chevronDir from './imgs/chevron-dir.svg';
import doubleArrowDir from './imgs/double-arrow-dir.svg';
import chevronEsq from './imgs/chevron-esq.svg';
import doubleArrowEsq from './imgs/double-arrow-esq.svg';

function NotasDashboard() {
  const [notes, setNotes] = useState([]);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({ site: '', equipment: '', startDate: '', endDate: '' });

  const emptyNote = { site: '', equipment: '', variable: '', author: '', message: '' };
  const [newNote, setNewNote] = useState(emptyNote);

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
    <> {/* Fragmento para não criar divs extras que quebram o CSS Grid do App */}
      <header className="header">
        <h2>Notas</h2>
      </header>

      <section className="filter-bar">
        <div className="filter-group">
          <input className="input-field" style={{ width: '230px' }} placeholder="Filtrar por Site" value={filters.site} onChange={e => { setFilters({ ...filters, site: e.target.value }); setPage(1); }} />
          <input className="input-field" style={{ width: '230px' }} placeholder="Filtrar por Equipamento" value={filters.equipment} onChange={e => { setFilters({ ...filters, equipment: e.target.value }); setPage(1); }} />
          <input className="input-field" style={{ width: '230px' }} type="date" value={filters.startDate} onChange={e => { setFilters({ ...filters, startDate: e.target.value }); setPage(1); }} />
          <input className="input-field" style={{ width: '230px' }} type="date" value={filters.endDate} onChange={e => { setFilters({ ...filters, endDate: e.target.value }); setPage(1); }} />
        </div>
        <button className="btn-success" onClick={() => { setNewNote(emptyNote); setIsModalOpen(true); }}>
          + Nova Nota
        </button>
      </section>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{newNote.id ? 'Editar Nota' : 'Nova Nota'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="close-btn">✕</button>
            </div>

            <form onSubmit={handleSaveNote} className="form-grid">
              <input className="input-field" placeholder="Site" required value={newNote.site} onChange={e => setNewNote({ ...newNote, site: e.target.value })} />
              <input className="input-field" placeholder="Equipamento" required value={newNote.equipment} onChange={e => setNewNote({ ...newNote, equipment: e.target.value })} />
              <input className="input-field" placeholder="Variável" required value={newNote.variable} onChange={e => setNewNote({ ...newNote, variable: e.target.value })} />
              <input className="input-field" placeholder="Autor" required value={newNote.author} onChange={e => setNewNote({ ...newNote, author: e.target.value })} />
              <textarea className="input-field full-width" style={{ minHeight: '100px' }} placeholder="Mensagem" required value={newNote.message} onChange={e => setNewNote({ ...newNote, message: e.target.value })} />

              <div className="modal-actions">
                <button type="submit" className="modal-btn-salvar">
                  {newNote.id ? 'Salvar' : 'Salvar'}
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
            {notes.map(note => (
              <tr key={note.id} className="clickable-row" onClick={() => { setNewNote(note); setIsModalOpen(true); }}>
                <td>{note.site}</td><td>{note.equipment}</td><td>{note.variable}</td>
                <td>{new Date(note.timestamp).toLocaleDateString()}</td><td>{note.author}</td>
                <td className="truncate-text">{note.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button className="page-btn nav-btn" disabled={page === 1} onClick={() => setPage(1)}><img src={doubleArrowEsq} style={{ height: '13px' }} alt="Seta para o primeiro" /></button>
        <button className="page-btn nav-btn" disabled={page === 1} onClick={() => setPage(page - 1)}><img src={chevronEsq} style={{ height: '13px' }} alt="Seta para a esquerda" /></button>

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

        <button className="page-btn nav-btn" disabled={page === totalPages || totalPages === 0} onClick={() => setPage(page + 1)}><img src={chevronDir} style={{ height: '13px' }} alt="Seta para a direita" /></button>
        <button className="page-btn nav-btn" disabled={page === totalPages || totalPages === 0} onClick={() => setPage(totalPages)}><img src={doubleArrowDir} style={{ height: '13px' }} alt="Seta para o último" /></button>
      </div>
    </>
  );
}

export default NotasDashboard;