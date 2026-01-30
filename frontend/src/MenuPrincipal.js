import React, { useState } from 'react';
import './Style.css'; // Importe corrigido para letras minúsculas
import logo from './imgs/logo.svg';
import home from './imgs/home.svg';
import analytics from './imgs/analytics.svg';
import notas from './imgs/notes.svg';
import history from './imgs/history.svg';
import map from './imgs/map.svg';
import dashboard from './imgs/dashboard.svg';
import logs from './imgs/logs.svg';
import home_hover from './imgs/home-hover.svg';
import analytics_hover from './imgs/analytics-hover.svg';
import notas_hover from './imgs/notes-hover.svg';
import history_hover from './imgs/history-hover.svg';
import map_hover from './imgs/map-hover.svg';
import dashboard_hover from './imgs/dashboard-hover.svg';
import logs_hover from './imgs/logs-hover.svg';

function MenuPrincipal({ paginaAtiva, setPaginaAtiva }) {
    // Lista de itens para facilitar a renderização e manutenção
    const menuItens = [
        { id: 'home', label: 'Home', icon: home, iconHover: home_hover },
        { id: 'analises', label: 'Análises', icon: analytics, iconHover: analytics_hover },
        { id: 'notas', label: 'Notas', icon: notas, iconHover: notas_hover },
        { id: 'historico', label: 'Histórico', icon: history, iconHover: history_hover },
        { id: 'mapa', label: 'Mapa', icon: map, iconHover: map_hover },
        { id: 'dashboard', label: 'Dashboard', icon: dashboard, iconHover: dashboard_hover },
    ];

    return (
        <aside className="sidebar">
            <div className="logo">
                <img src={logo} alt="Logo" />
            </div>

            <h3 className="menuprincipal">MENU PRINCIPAL</h3>
            <nav>
                {menuItens.map((item) => {
                    const usarIconeDestaque = (paginaAtiva === item.id);

                    return (
                        <div
                            key={item.id}
                            className={`nav-item ${paginaAtiva === item.id ? 'active' : ''}`}
                            onClick={() => setPaginaAtiva(item.id)}
                        >
                            <img
                                src={usarIconeDestaque ? item.iconHover : item.icon}
                                alt={item.label}
                                style={{ width: '20px', marginRight: '10px' }}
                            />
                            {item.label}
                        </div>
                    );
                })}
            </nav>

            <hr style={{ marginBottom: '20px', marginTop: '10px', border: '0.5px solid rgba(255,255,255,0.1)' }} />

            <h3 className="menuprincipal">OPÇÕES</h3>
            <nav>
                <div
                    className={`nav-item ${paginaAtiva === 'logs' ? 'active' : ''}`}
                    onClick={() => setPaginaAtiva('logs')}
                >
                    <img
                        src={paginaAtiva === 'logs' ? logs_hover : logs}
                        alt="Logs"
                        style={{ width: '20px', marginRight: '10px' }}
                    />
                    Logs
                </div>
            </nav>
        </aside>
    );
}

export default MenuPrincipal;