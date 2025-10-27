import '../App.css';

function DeleteRecordModal({ show, isClosing, record, onCancel, onConfirm }) {
  if (!show || !record) return null;

  return (
    <div className={`modal-overlay ${isClosing ? 'closing' : ''}`} onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onCancel}>×</button>
        <h3>Are you sure you want to delete this record?</h3>
        <p>{record.title} – {record.artist}</p>
        <div className="modal-buttons">
          <button className="btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="btn-confirm-delete" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteRecordModal;
