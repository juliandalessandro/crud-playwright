import "../App.css";
import { useToast } from "../context/ToastContext";

function EditRecordModal({ show, isClosing, record, onClose, onChange, onSubmit, isChanged }) {
  const { showToast } = useToast();

  if (!show || !record) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(e);
      showToast("Record updated successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast("Error updating record", "error");
    }
  };

  return (
    <div className={`modal-overlay ${isClosing ? "closing" : ""}`} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h3>Edit Record</h3>

        <form className="modal-form" onSubmit={handleSubmit}>
          <input
            className="form-input"
            type="text"
            name="title"
            placeholder="Title"
            value={record.title}
            onChange={onChange}
            required
          />
          <input
            className="form-input"
            type="text"
            name="artist"
            placeholder="Artist"
            value={record.artist}
            onChange={onChange}
            required
          />
          <input
            className="form-input"
            type="number"
            name="year"
            placeholder="Year"
            value={record.year}
            onChange={onChange}
            required
          />
          <input
            className="form-input"
            type="text"
            name="genre"
            placeholder="Genre"
            value={record.genre}
            onChange={onChange}
            required
          />
          <input
            className="form-input"
            type="text"
            name="cover"
            placeholder="Cover"
            value={record.cover}
            onChange={onChange}
            required
          />

          <button className="btn-submit" type="submit" disabled={!isChanged()}>
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditRecordModal;
