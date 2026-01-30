@echo off
echo ==========================================
echo   Iniciando Projeto: Desafio Full Stack
echo ==========================================

:: Iniciar o Backend - Iniciando Servidor Backend (FastAPI)...
start cmd /k "cd backend && ..\.venv\Scripts\activate && uvicorn main:app --reload --port 8000"

:: Iniciar o Frontend - Iniciando Interface Frontend (React)...
cd frontend && npm start

exit