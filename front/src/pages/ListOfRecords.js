import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import '../App.css';

function ListOfRecords() {

  const location = useLocation();

  const [listOfRecords, setListOfRecords] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

  // Estados para edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [editRecord, setEditRecord] = useState({
    title: "",
    artist: "",
    year: "",
    genre: "",
    cover: ""
  });
  const [editMessage, setEditMessage] = useState("");

  // Toast de upload
  const [uploadMessage, setUploadMessage] = useState("");

  // ====== Obtener records ======
  useEffect(() => {
    axios.get("http://localhost:3001/records").then((response) => {
      setListOfRecords(response.data);
    });
  }, []);

  // ====== Toast de upload desde redirección ======
  useEffect(() => {
    if (location.state?.toastMessage) {
      setUploadMessage(location.state.toastMessage);
      const timer = setTimeout(() => setUploadMessage(""), 2500);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // ====== Esc para cerrar modales ======
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleCloseDelete();
        handleCloseEdit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleEditChange = (e) => {
    setEditRecord({ ...editRecord, [e.target.name]: e.target.value });
  };

  // ================== DELETE ==================
  const handleDelete = (record) => {
    setRecordToDelete(record);
    setShowDeleteModal(true);
  };

  const handleCloseDelete = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowDeleteModal(false);
      setIsClosing(false);
    }, 200);
  };

  const handleConfirmDelete = async () => {
    if (!recordToDelete) return;
    try {
      await axios.delete(`http://localhost:3001/records/${recordToDelete.id}`);
      handleCloseDelete();
      setListOfRecords(prev => prev.filter(r => r.id !== recordToDelete.id));
      setDeleteMessage(`Deleted: ${recordToDelete.title}`);
      setTimeout(() => setDeleteMessage(""), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  // ================== EDIT ==================
  const handleEdit = (record) => {
    setRecordToEdit(record);
    setEditRecord({ ...record });
    setShowEditModal(true);
    document.body.classList.add("modal-open");
  };

  const isEditChanged = () => {
    if (!recordToEdit) return false;

    return Object.keys(recordToEdit).some((key) => {
      const original = recordToEdit[key];
      const current = editRecord[key];

      // Convertir a string para comparar
      return String(original) !== String(current);
    });
  };


  const handleCloseEdit = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowEditModal(false);
      setIsClosing(false);
      document.body.classList.remove("modal-open");
    }, 200);
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!recordToEdit) return;

    try {
      handleCloseEdit(); // cierra modal rápido con fade

      await axios.put(`http://localhost:3001/records/${recordToEdit.id}`, editRecord);

      setListOfRecords(prev =>
        prev.map(r => r.id === recordToEdit.id ? editRecord : r)
      );

      setEditMessage("Record updated");
      setTimeout(() => setEditMessage(""), 2500);

    } catch (err) {
      console.error(err);
      setEditMessage("Error updating record");
      setTimeout(() => setEditMessage(""), 2500);
    }
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
              <button className="btn-edit" onClick={() => handleEdit(record)}>✏️</button>
              <button className="btn-delete" onClick={() => handleDelete(record)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className={`modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleCloseDelete}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseDelete}>×</button>
            <h3>Are you sure you want to delete this record?</h3>
            <p>{recordToDelete?.title} – {recordToDelete?.artist}</p>
            <div className="modal-buttons">
              <button className="btn-cancel" onClick={handleCloseDelete}>Cancel</button>
              <button className="btn-confirm-delete" onClick={handleConfirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className={`modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleCloseEdit}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseEdit}>×</button>
            <h3>Edit Record</h3>

            <form className="modal-form" onSubmit={handleSubmitEdit}>
              <input
                className="form-input"
                type="text"
                name="title"
                placeholder="Title"
                value={editRecord.title}
                onChange={handleEditChange}
                required
              />
              <input
                className="form-input"
                type="text"
                name="artist"
                placeholder="Artist"
                value={editRecord.artist}
                onChange={handleEditChange}
                required
              />
              <input
                className="form-input"
                type="number"
                name="year"
                placeholder="Year"
                value={editRecord.year}
                onChange={handleEditChange}
                required
              />
              <input
                className="form-input"
                type="text"
                name="genre"
                placeholder="Genre"
                value={editRecord.genre}
                onChange={handleEditChange}
                required
              />
              <input
                className="form-input"
                type="text"
                name="cover"
                placeholder="Cover"
                value={editRecord.cover}
                onChange={handleEditChange}
                required
              />

              <button className="btn-upload" type="submit" disabled={!isEditChanged()}>Save</button>
            </form>
          </div>
        </div>
      )}

      {/* Toasts */}
      {editMessage && <div className="toast-message-edit-upload">{editMessage}</div>}
      {deleteMessage && <div className="toast-message">{deleteMessage}</div>}
      {uploadMessage && <div className="toast-message-edit-upload">{uploadMessage}</div>}
    </div>
  );
}

export default ListOfRecords;
