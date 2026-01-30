# Desafio Full Stack - Sistema de Notas de Equipamentos

Este projeto é uma solução Full Stack desenvolvida para o gerenciamento de notas técnicas de equipamentos. A aplicação permite o acompanhamento de variáveis operacionais, sites e mensagens de manutenção através de uma interface moderna e intuitiva.

## Tecnologias Utilizadas

* **Backend:** Python 3.x com framework **FastAPI**.
* **Frontend:** React.js com Hooks (useState, useEffect, useCallback).
* **Banco de Dados:** SQLite3.
* **Processamento de Dados:** Pandas (utilizado para o processo de Seed).

## Funcionalidades Principais

* **CRUD Completo (Create, Read, Update, Delete):** Gerenciamento total das notas.
* **Lógica de Upsert:** O componente NotasDashboard utiliza um formulário único para criação e edição, diferenciando a ação pela presença de um ID único (UUID).
* **Seed Automático:** Ao iniciar o backend pela primeira vez, o sistema popula o banco de dados automaticamente a partir de um arquivo CSV.
* **Paginação em Janela (Sliding Window):** Interface de paginação que exibe apenas os números próximos à página atual, garantindo performance e limpeza visual.
* **Filtros Dinâmicos:** Pesquisa em tempo real por Site, Equipamento e Período de Datas.
* **UX/UI:** Tabela com linhas clicáveis, efeitos de hover e modal integrado.

## Como Executar

### 1. Preparando o Backend (Python)

    Recomenda-se o uso de um ambiente virtual (venv).

    1. Abra o terminal na raiz do projeto e acesse a pasta do backend:
        cd backend
    2. Instale as dependências:
        pip install -r requirements.txt
    3. Inicie o servidor:
        uvicorn main:app --reload
    
    O servidor estará disponível em http://127.0.0.1:8000.

### 2. Preparando o Frontend (React)

    1. Abra um novo terminal na raiz do projeto e acesse a pasta do frontend:
        cd frontend
    2. Instale as dependências:
        npm install
    3. Inicie a aplicação:
        npm start
    
    A aplicação abrirá em http://localhost:3000.

### Dica: Atalho para Iniciar o Projeto

    Para facilitar a execução, você pode criar um arquivo chamado iniciar_projeto.bat na raiz do projeto com o seguinte conteúdo:

    @echo off
    echo ==========================================
    echo    Iniciando Projeto: Desafio Full Stack
    echo ==========================================

    :: Iniciar o Backend
    start cmd /k "cd backend && uvicorn main:app --reload --port 8000"

    :: Iniciar o Frontend
    start cmd /k "cd frontend && npm start"

    exit


