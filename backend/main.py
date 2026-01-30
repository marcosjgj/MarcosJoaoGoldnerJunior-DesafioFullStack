import pandas as pd
import sqlite3
from fastapi import FastAPI, Query, HTTPException
from typing import Optional
import uuid
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Desafio Oxyn API")
DB_PATH = "database.db"
CSV_PATH = "../materials/notes.csv"

# Configuração de CORS para o React conseguir conversar com o Python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS notes (
            id TEXT PRIMARY KEY,
            site TEXT,
            equipment TEXT,
            variable TEXT,
            timestamp TEXT,
            author TEXT,
            message TEXT
        )
    ''')
    
    cursor.execute("SELECT COUNT(*) FROM notes")
    if cursor.fetchone()[0] == 0:
        if os.path.exists(CSV_PATH):
            df = pd.read_csv(CSV_PATH)
            if 'id' not in df.columns:
                df['id'] = [str(uuid.uuid4()) for _ in range(len(df))]
            df.to_sql('notes', conn, if_exists='append', index=False)
            print("Seed finalizado!")
    conn.close()

init_db()

# --- ENDPOINTS ---

@app.get("/api/v1/notes")
def get_notes(
    site: Optional[str] = None, 
    equipment: Optional[str] = None, 
    startDate: Optional[str] = None, 
    endDate: Optional[str] = None,
    page: int = 1, 
    limit: int = 10 
):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    base_query = " FROM notes WHERE 1=1"
    params = []

    if site:
        base_query += " AND site = ?"
        params.append(site)
    if equipment:
        base_query += " AND equipment = ?"
        params.append(equipment)
    if startDate and endDate:
        base_query += " AND timestamp BETWEEN ? AND ?"
        params.append(startDate)
        params.append(endDate)

    # Total para a paginação numerada do Front
    total_records = conn.execute("SELECT COUNT(*)" + base_query, params).fetchone()[0]

    # Itens paginados
    offset = (page - 1) * limit
    items_query = "SELECT *" + base_query + f" LIMIT {limit} OFFSET {offset}"
    
    cursor = conn.execute(items_query, params)
    notes = [dict(row) for row in cursor.fetchall()]
    conn.close()

    return {
        "items": notes,
        "total": total_records,
        "page": page,
        "limit": limit
    }

@app.post("/api/v1/notes")
def create_note(note: dict):
    # Gera um ID novo apenas se não existir (evita erro no upsert)
    if 'id' not in note or not note['id']:
        note['id'] = str(uuid.uuid4())
        
    conn = sqlite3.connect(DB_PATH)
    try:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO notes (id, site, equipment, variable, timestamp, author, message)
            VALUES (:id, :site, :equipment, :variable, :timestamp, :author, :message)
        ''', note)
        conn.commit()
    finally:
        conn.close()
    return note

# NOVA ROTA: Alterar nota existente
@app.put("/api/v1/notes/{note_id}")
def update_note(note_id: str, note: dict):
    conn = sqlite3.connect(DB_PATH)
    try:
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE notes 
            SET site=?, equipment=?, variable=?, author=?, message=?
            WHERE id=?
        ''', (note['site'], note['equipment'], note['variable'], note['author'], note['message'], note_id))
        conn.commit()
    finally:
        conn.close()
    return {"message": "Atualizado com sucesso"}

# Rota para Deletar - Ajustada para aceitar STRING (UUID)
@app.delete("/api/v1/notes/{note_id}")
def delete_note(note_id: str):
    conn = sqlite3.connect(DB_PATH)
    try:
        conn.execute("DELETE FROM notes WHERE id = ?", (note_id,))
        conn.commit()
    finally:
        conn.close()
    return {"message": "Nota removida com sucesso"}