import React, { useState } from 'react';
import MenuPrincipal from './MenuPrincipal';
import NotasDashboard from './NotasDashboard';
import './Style.css';

function App() {
    // Definimos 'notas' como a página inicial ativa
    const [paginaAtiva, setPaginaAtiva] = useState('notas');

    // Função que decide qual componente renderizar na área principal
    const renderConteudo = () => {
        switch (paginaAtiva) {
            case 'notas':
                return <NotasDashboard />;
            case 'home':
                return (
                    <div className="header">
                        <h2>Bem-vindo ao Oxyn Notas</h2>
                        <p style={{ marginTop: '20px', color: '#666' }}>
                            Selecione "Notas" no menu lateral para gerenciar os registros dos equipamentos.
                        </p>
                    </div>
                );
            case 'analises':
                return (
                    <div className="header">
                        <h2>Análises</h2>
                        <p style={{ marginTop: '20px', color: '#666' }}>
                            Página de Análises em construção.
                        </p>
                    </div>
                );
            case 'historico':
                return (
                    <div className="header">
                        <h2>Histórico</h2>
                        <p style={{ marginTop: '20px', color: '#666' }}>
                            Página de Histórico em construção.
                        </p>
                    </div>
                );
            case 'mapa':
                return (
                    <div className="header">
                        <h2>Mapa</h2>
                        <p style={{ marginTop: '20px', color: '#666' }}>
                            Página de Mapa em construção.
                        </p>
                    </div>
                );
            case 'dashboard':
                return (
                    <div className="header">
                        <h2>Dashboard</h2>
                        <p style={{ marginTop: '20px', color: '#666' }}>
                            Página de Dashboard em construção.
                        </p>
                    </div>
                );
            case 'logs':
                return (
                    <div className="header">
                        <h2>Logs</h2>
                        <p style={{ marginTop: '20px', color: '#666' }}>
                            Página de Logs em construção.
                        </p>
                    </div>
                );
            default:
                return <NotasDashboard />;
        }
    };

    return (
        <div className="app-container">
            <MenuPrincipal paginaAtiva={paginaAtiva} setPaginaAtiva={setPaginaAtiva} />

            <main className="main-content">
                {renderConteudo()}
            </main>
        </div>
    );
}

export default App;