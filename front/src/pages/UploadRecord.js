import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRecord } from "../services/recordsApi"; 
import { useToast } from "../context/ToastContext";
import "../App.css";
import Navbar from "../components/Navbar";

function UploadRecord() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [record, setRecord] = useState({
    title: "",
    artist: "",
    year: "",
    genre: "",
    cover: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setRecord({ ...record, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createRecord(record);
      setRecord({ title: "", artist: "", year: "", genre: "", cover: "" });

      showToast("Record uploaded successfully!", "success");
      navigate("/", { replace: true });

    } catch (err) {
      console.error(err);
      showToast("Error uploading record", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="form-container">
        <h2>Upload Record</h2>
        <form onSubmit={handleSubmit}>
          {/* inputs */}
          <input className="form-input" type="text" name="title" placeholder="Title" value={record.title} onChange={handleChange} required />
          <input className="form-input" type="text" name="artist" placeholder="Artist" value={record.artist} onChange={handleChange} required />
          <input className="form-input" type="number" name="year" placeholder="Year" value={record.year} onChange={handleChange} required />
          <input className="form-input" type="text" name="genre" placeholder="Genre" value={record.genre} onChange={handleChange} required />
          <input className="form-input" type="text" name="cover" placeholder="Cover URL" value={record.cover} onChange={handleChange} required />

          <button className="btn-submit" type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadRecord;
