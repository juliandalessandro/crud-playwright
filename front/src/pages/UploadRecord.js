import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../App.css';

function UploadRecord() {

  const navigate = useNavigate();

  const [record, setRecord] = useState({
    title: "",
    artist: "",
    year: "",
    genre: "",
    cover: ""
  });

  const handleChange = (e) => {
    setRecord({ ...record, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3001/records", record);

      // Limpiar form
      setRecord({ title: "", artist: "", year: "", genre: "", cover: "" });

      // Redirigir al home y pasar mensaje como estado
      // 'replace: true' evita que el toast reaparezca al refrescar la página
      navigate("/", { 
        state: { toastMessage: "Record uploaded successfully" }, 
        replace: true 
      });

    } catch (err) {
      console.error(err);
      alert("Error uploading record"); // puedes reemplazar por toast de error si querés
    }
  };

  return (
    <div className="form-container">
      <h2>Upload Record</h2>

      <form onSubmit={handleSubmit}>
        <input
          className="form-input"
          type="text"
          name="title"
          placeholder="Title"
          value={record.title}
          onChange={handleChange}
          required
        />
        <input
          className="form-input"
          type="text"
          name="artist"
          placeholder="Artist"
          value={record.artist}
          onChange={handleChange}
          required
        />
        <input
          className="form-input"
          type="number"
          name="year"
          placeholder="Year"
          value={record.year}
          onChange={handleChange}
          required
        />
        <input
          className="form-input"
          type="text"
          name="genre"
          placeholder="Genre"
          value={record.genre}
          onChange={handleChange}
          required
        />
        <input
          className="form-input"
          type="text"
          name="cover"
          placeholder="Cover"
          value={record.cover}
          onChange={handleChange}
          required
        />

        <button className="btn-upload" type="submit">Upload</button>
      </form>
    </div>
  );
}

export default UploadRecord;
