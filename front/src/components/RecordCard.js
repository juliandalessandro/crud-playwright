import React from 'react';
import '../App.css';

function RecordCard({ record, onEdit, onDelete }) {
  return (
    <div className="record-card" data-testid="record-recordsPage-card">
      <img
        src={record.cover}
        alt={record.title}
        className="record-cover"
      />

      <h3 className="record-title">
        {record.title} <span>({record.year})</span>
      </h3>

      <p className="record-artist">{record.artist}</p>
      <p className="record-genre">{record.genre}</p>

      <div className="card-actions">
        <button className="btn-edit" data-testid="record-recordsPage-edit-button" onClick={() => onEdit(record)}>✏️</button>
        <button className="btn-delete" data-testid="record-recordsPage-delete-button" onClick={() => onDelete(record)}>🗑️</button>
      </div>
    </div>
  );
}

export default RecordCard;
