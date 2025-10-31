// REACT imports
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

// API service
import { getRecords, deleteRecord, updateRecord } from "../services/recordsApi";

// CSS import
import "../App.css";

// COMPONENTS imports
import EditRecordModal from "../components/EditRecordModal";
import DeleteRecordModal from "../components/DeleteRecordModal";
import SearchRecordField from "../components/SearchRecordField";
import RecordCard from "../components/RecordCard";

function ListOfRecords() {
  const location = useLocation();
  const [listOfRecords, setListOfRecords] = useState([]);
  const [isClosing, setIsClosing] = useState(false);

  // FETCH status
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // SEARCH + DEBOUNCE
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // EDIT
  const [showEditModal, setShowEditModal] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [editRecord, setEditRecord] = useState({
    title: "",
    artist: "",
    year: "",
    genre: "",
    cover: "",
  });
  const [editMessage, setEditMessage] = useState("");

  // DELETE
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");

  // UPLOAD toast
  const [uploadMessage, setUploadMessage] = useState("");

  /* ------------------ FETCH records ------------------ */
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getRecords();
        if (mounted) setListOfRecords(data || []);
      } catch (err) {
        console.error("Error fetching records:", err);
        if (mounted) setError("Failed to load records. Please try again.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => { mounted = false };
  }, []);

  /* ------------------ HANDLE UPLOAD TOAST ------------------ */
  useEffect(() => {
    if (location.state?.toastMessage) {
      setUploadMessage(location.state.toastMessage);
      try { window.history.replaceState({}, document.title); } catch {}
      const timer = setTimeout(() => setUploadMessage(""), 2500);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  /* ------------------ SEARCH ------------------ */
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const filteredRecords = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return listOfRecords;
    return listOfRecords.filter((r) =>
      (r.title || "").toLowerCase().includes(q)
    );
  }, [listOfRecords, debouncedSearch]);

  /* ------------------ KEYBOARD ESC ------------------ */
  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && (handleCloseDelete(), handleCloseEdit());
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  /* ------------------ DELETE ------------------ */
  const handleDelete = (record) => {
    setRecordToDelete(record);
    setShowDeleteModal(true);
  };

  const handleCloseDelete = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowDeleteModal(false);
      setIsClosing(false);
      setRecordToDelete(null);
    }, 200);
  };

  const handleConfirmDelete = async () => {
    if (!recordToDelete) return;
    try {
      await deleteRecord(recordToDelete.id);
      handleCloseDelete();
      setListOfRecords((prev) => prev.filter((r) => r.id !== recordToDelete.id));
      setDeleteMessage(`Deleted: ${recordToDelete.title}`);
      setTimeout(() => setDeleteMessage(""), 2500);
    } catch (err) {
      console.error("Error deleting record:", err);
    }
  };

  /* ------------------ EDIT ------------------ */
  const handleEdit = (record) => {
    setRecordToEdit(record);
    setEditRecord({
      title: record.title ?? "",
      artist: record.artist ?? "",
      year: record.year ?? "",
      genre: record.genre ?? "",
      cover: record.cover ?? "",
    });
    setShowEditModal(true);
    document.body.classList.add("modal-open");
  };

  const handleEditChange = (e) => {
    setEditRecord((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isEditChanged = () => {
    if (!recordToEdit) return false;
    const fields = ["title", "artist", "year", "genre", "cover"];
    return fields.some(
      (key) => String(recordToEdit[key] ?? "") !== String(editRecord[key] ?? "")
    );
  };

  const handleCloseEdit = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowEditModal(false);
      setIsClosing(false);
      document.body.classList.remove("modal-open");
      setRecordToEdit(null);
      setEditRecord({ title: "", artist: "", year: "", genre: "", cover: "" });
    }, 200);
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!recordToEdit) return;

    try {
      handleCloseEdit();
      await updateRecord(recordToEdit.id, editRecord);

      setListOfRecords((prev) =>
        prev.map((r) =>
          r.id === recordToEdit.id ? { ...r, ...editRecord } : r
        )
      );

      setEditMessage("Record updated");
      setTimeout(() => setEditMessage(""), 2500);
    } catch (err) {
      console.error("Error updating record:", err);
      setEditMessage("Error updating record");
      setTimeout(() => setEditMessage(""), 2500);
    }
  };

  /* ------------------ LOADING & ERROR ------------------ */
  if (loading) {
    return (
      <div className="records-container">
        <h2>List of Records</h2>
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <span className="loading-text">Loading records...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="records-container">
        <h2>List of Records</h2>
        <p className="error-message">{error}</p>
        <button className="btn-retry" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }


  /* ------------------ RENDER ------------------ */
  return (
    <div className="records-container">
      <SearchRecordField search={search} setSearch={setSearch} />

      <h2>List of Records</h2>

      {filteredRecords.length === 0 ? (
        <p className="no-records">
          {listOfRecords.length === 0
            ? "No records stored yet."
            : "No results found for your search."}
        </p>
      ) : (
        <div className="records-grid">
          {filteredRecords.map((record) => (
            <RecordCard
              key={record.id}
              record={record}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showDeleteModal && (
        <DeleteRecordModal
          show={showDeleteModal}
          isClosing={isClosing}
          record={recordToDelete}
          onCancel={handleCloseDelete}
          onConfirm={handleConfirmDelete}
        />
      )}

      {showEditModal && (
        <EditRecordModal
          show={showEditModal}
          isClosing={isClosing}
          record={editRecord}
          onClose={handleCloseEdit}
          onChange={handleEditChange}
          onSubmit={handleSubmitEdit}
          isChanged={isEditChanged}
        />
      )}

      {/* Toasts */}
      {editMessage && <div className="toast-message-edit-upload">{editMessage}</div>}
      {deleteMessage && <div className="toast-message">{deleteMessage}</div>}
      {uploadMessage && <div className="toast-message-edit-upload">{uploadMessage}</div>}
    </div>
  );
}

export default ListOfRecords;
