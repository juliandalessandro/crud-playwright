import axios from "axios";
import { useState } from "react";


function UploadRecord() {

    const [message, setMessage] = useState("");

    const [record, setRecord] = useState({
        title: "",
        artist: "",
        year: "",
        genre: ""
    });

    const handleChange = (e) => {
        setRecord({ ...record, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post("http://localhost:3001/records", record)
            .then(() => {
            setMessage("✅ Registro creado con éxito!");
            setRecord({ title: "", artist: "", year: "", genre: "", cover: "" });
            })
            .catch((err) => {
            console.error(err);
            setMessage("❌ Error al crear el registro");
            });
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

            {message && (
            <p className={message.includes("✅") ? "message-success" : "message-error"}>
                {message}
            </p>
            )}
        </div>
    );

}

export default UploadRecord;