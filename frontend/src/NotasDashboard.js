import React, { useState, useEffect, useCallback } from 'react';
import './NotasDashboard.css';
import logo from './imgs/logo.svg';
import home from './imgs/home.svg';
import analytics from './imgs/analytics.svg';
import notas from './imgs/notes.svg';
import history from './imgs/history.svg';
import map from './imgs/map.svg';
import dashboard from './imgs/dashboard.svg';
import logs from './imgs/logs.svg';

function NotasDashboard() {
  const [notes, setNotes] = useState([]);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({ site: '', equipment: '', startDate: '', endDate: '' });

  const emptyNote = { site: '', equipment: '', variable: '', author: '', message: '' };
  const [newNote, setNewNote] = useState(emptyNote);

  const limit = 6;

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
  }, [filters, page, limit]);

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
    <div className="container">
      <aside className="sidebar">
        <div className="logo"><img src={logo} alt="Logo" /></div>
        <h3 className="menuprincipal">MENU PRINCIPAL</h3>
        <nav>
          <div className="nav-item"><img src={home} alt="Home" style={{ width: '20px', marginRight: '10px' }} /> Home</div>
          <div className="nav-item"><img src={analytics} alt="Análises" style={{ width: '20px', marginRight: '10px' }} />Análises</div>
          <div className="nav-item active"><img src={notas} alt="Notas" style={{ width: '20px', marginRight: '10px' }} />Notas</div>
          <div className="nav-item"><img src={history} alt="Histórico" style={{ width: '20px', marginRight: '10px' }} />Histórico</div>
          <div className="nav-item"><img src={map} alt="Mapa" style={{ width: '20px', marginRight: '10px' }} />Mapa</div>
          <div className="nav-item"><img src={dashboard} alt="Dashboard" style={{ width: '20px', marginRight: '10px' }} />Dashboard</div>
        </nav>
        <hr style={{ marginBottom: '20px', marginTop: '10px' }} />
        <h3 className="menuprincipal">OPÇÕES</h3>
        <nav>

          <div className="nav-item"><img src={logs} alt="Logs" style={{ width: '20px', marginRight: '10px' }} />Logs</div>
        </nav>
      </aside>

      <main className="main-content">
        <header className="header">
          <h2>Notas</h2>
        </header>

        <section className="filter-bar">
          <div className="filter-group">
            <input className="input-field" placeholder="Filtrar por Site" value={filters.site} onChange={e => { setFilters({ ...filters, site: e.target.value }); setPage(1); }} />
            <input className="input-field" placeholder="Filtrar por Equipamento" value={filters.equipment} onChange={e => { setFilters({ ...filters, equipment: e.target.value }); setPage(1); }} />
            <input className="input-field" type="date" value={filters.startDate} onChange={e => { setFilters({ ...filters, startDate: e.target.value }); setPage(1); }} />
            <input className="input-field" type="date" value={filters.endDate} onChange={e => { setFilters({ ...filters, endDate: e.target.value }); setPage(1); }} />
          </div>
          <button className="btn-success" onClick={() => { setNewNote(emptyNote); setIsModalOpen(true); }}>
            + Nova Nota
          </button>
        </section>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3>{newNote.id ? 'Editar Nota' : 'Nova Nota'}</h3>
                <button onClick={() => setIsModalOpen(false)} style={{ cursor: 'pointer', border: 'none', background: 'none', fontSize: '18px' }}>✕</button>
              </div>

              <form onSubmit={handleSaveNote} className="form-grid">
                <input className="input-field" placeholder="Site" required value={newNote.site} onChange={e => setNewNote({ ...newNote, site: e.target.value })} />
                <input className="input-field" placeholder="Equipamento" required value={newNote.equipment} onChange={e => setNewNote({ ...newNote, equipment: e.target.value })} />
                <input className="input-field" placeholder="Variável" required value={newNote.variable} onChange={e => setNewNote({ ...newNote, variable: e.target.value })} />
                <input className="input-field" placeholder="Autor" required value={newNote.author} onChange={e => setNewNote({ ...newNote, author: e.target.value })} />
                <textarea className="input-field full-width" style={{ minHeight: '100px' }} placeholder="Mensagem" required value={newNote.message} onChange={e => setNewNote({ ...newNote, message: e.target.value })} />

                <div style={{ display: 'flex', gap: '10px', gridColumn: 'span 2' }}>
                  <button type="submit" className="modal-btn-salvar" style={{ flex: 2 }}>
                    {newNote.id ? 'Salvar Alterações' : 'Criar Nota'}
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
                <th>Site</th><th>Equipamento</th><th>Variável</th><th>Data</th><th>Autor</th><th>Mensagem</th>
              </tr>
            </thead>
            <tbody>
              {notes.map(note => (
                <tr key={note.id} className="clickable-row" onClick={() => { setNewNote(note); setIsModalOpen(true); }}>
                  <td>{note.site}</td><td>{note.equipment}</td><td>{note.variable}</td>
                  <td>{new Date(note.timestamp).toLocaleDateString()}</td><td>{note.author}</td><td>{note.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINAÇÃO MELHORADA (JANELA DESLIZANTE) */}
        <div className="pagination">
          {/* Vai para a primeira página */}
          <button className="page-btn nav-btn" disabled={page === 1} onClick={() => setPage(1)}>«</button>

          {/* Volta uma página */}
          <button className="page-btn nav-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>&lt;</button>

          {/* Lógica para mostrar apenas 5 botões próximos à página atual */}
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

          {/* Avança uma página */}
          <button className="page-btn nav-btn" disabled={page === totalPages || totalPages === 0} onClick={() => setPage(page + 1)}>&gt;</button>

          {/* Vai para a última página */}
          <button className="page-btn nav-btn" disabled={page === totalPages || totalPages === 0} onClick={() => setPage(totalPages)}>»</button>
        </div>
      </main>
    </div>
  );
}

export default NotasDashboard;