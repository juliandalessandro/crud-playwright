import axios from "axios";
import { useEffect, useState } from "react";
import '../App.css';

function ListOfRecords() {

  const [listOfRecords, setListOfRecords] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [isClosing, setIsClosing] = useState(false);


  useEffect(() => {
    axios.get("http://localhost:3001/records").then((response) => {
      setListOfRecords(response.data);
    });
  }, []);

  useEffect(() => {
    if (showDeleteModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };

    if (showDeleteModal) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showDeleteModal]);

  const handleEdit = (e) => {
      console.log("Edit")
  };

  const handleDelete = (record) => {
      setRecordToDelete(record);
      setShowDeleteModal(true);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowDeleteModal(false);
      setIsClosing(false);
    }, 200);
  };

  const handleConfirmDelete = () => {
  axios.delete(`http://localhost:3001/records/${recordToDelete.id}`)
    .then(() => {
      setListOfRecords(listOfRecords.filter(r => r.id !== recordToDelete.id));
      handleClose();
    })
    .catch(err => console.error(err));
};

  return (
    <div className="records-container">
      <h2>List of Records</h2>

      <div className="records-grid">
        {listOfRecords.map((record) => (
          <div className="record-card" key={record.id}>
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
              <button className="btn-edit" onClick={handleEdit}>✏️</button>
              <button className="btn-delete" onClick={() => handleDelete(record)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {showDeleteModal && (
        <div className={`modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleClose}>×</button>

            <h3>Are you sure you want to delete this record?</h3>
            <p>{recordToDelete?.title} – {recordToDelete?.artist}</p>

            <div className="modal-buttons">
              <button className="btn-cancel" onClick={handleClose}>
                Cancel
              </button>

              <button className="btn-confirm-delete" onClick={handleConfirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListOfRecords;
