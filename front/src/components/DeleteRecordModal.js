import "../App.css";
import { useToast } from "../context/ToastContext";

function DeleteRecordModal({ show, isClosing, record, onCancel, onConfirm }) {
  const { showToast } = useToast();

  if (!show || !record) return null;

  const handleConfirm = async () => {
    try {
      await onConfirm();
      showToast("Record deleted successfully!", "delete");
    } catch (err) {
      console.error(err);
      showToast("Error deleting record", "error");
    }
  };

  return (
    <div className={`modal-overlay ${isClosing ? "closing" : ""}`} onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onCancel}>
          ×
        </button>
        <h3>Are you sure you want to delete this record?</h3>
        <p>
          {record.title} – {record.artist}
        </p>
        <div className="modal-buttons">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-confirm-delete" onClick={handleConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteRecordModal;
