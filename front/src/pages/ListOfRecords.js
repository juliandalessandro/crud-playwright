// REACT imports
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

// API service
import { getRecords, deleteRecord, updateRecord } from "../services/recordsApi";

// CSS import
import "../App.css";

// COMPONENTS imports
import Navbar from "../components/Navbar";
import EditRecordModal from "../components/EditRecordModal";
import DeleteRecordModal from "../components/DeleteRecordModal";
import SearchRecordField from "../components/SearchRecordField";
import RecordCard from "../components/RecordCard";
import Spinner from "../components/Spinner";

// CONTEXT
import { useToast } from "../context/ToastContext";

function ListOfRecords() {
  const location = useLocation();
  const { showToast } = useToast();

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

  // DELETE
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

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
    return () => {
      mounted = false;
    };
  }, []);

  /* ------------------ HANDLE UPLOAD TOAST ------------------ */
  useEffect(() => {
    if (location.state?.toastMessage) {
      showToast(location.state.toastMessage, "success");
      try {
        window.history.replaceState({}, document.title);
      } catch {}
    }
  }, [location.state, showToast]);

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
    const handleKey = (e) =>
      e.key === "Escape" && (handleCloseDelete(), handleCloseEdit());
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
      setListOfRecords((prev) =>
        prev.filter((r) => r.id !== recordToDelete.id)
      );
      showToast(`Deleted: ${recordToDelete.title}`, "success");
    } catch (err) {
      console.error("Error deleting record:", err);
      showToast("Error deleting record", "error");
    }
  };

  /* ------------------ EDIT ------------------ */
  const handleEdit = (record) => {
    setRecordToEdit(record);
    setShowEditModal(true);
    document.body.classList.add("modal-open");
  };

  const handleCloseEdit = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowEditModal(false);
      setIsClosing(false);
      document.body.classList.remove("modal-open");
      setRecordToEdit(null);
    }, 200);
  };

  const handleSubmitEdit = async (id, data) => {
    try {
      await updateRecord(id, data);
      setListOfRecords((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...data } : r))
      );
    } catch (err) {
      console.error("Error updating record:", err);
      throw err; // para que el modal muestre toast de error
    }
  };

  /* ------------------ LOADING & ERROR ------------------ */
  if (loading) {
    return (
      <div className="records-container">
        <h2>List of Records</h2>
        <div className="loading-overlay">
          <Spinner />
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
    <div>
      <Navbar />
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

        {showEditModal && recordToEdit && (
          <EditRecordModal
            show={showEditModal}
            isClosing={isClosing}
            record={recordToEdit}
            onClose={handleCloseEdit}
            onSubmit={handleSubmitEdit}
          />
        )}
      </div>
    </div>
  );
}

export default ListOfRecords;
