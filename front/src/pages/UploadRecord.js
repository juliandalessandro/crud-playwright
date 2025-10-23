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
            setRecord({ title: "", artist: "", year: "", genre: "" });
            })
            .catch((err) => {
            console.error(err);
            setMessage("❌ Error al crear el registro");
            });
    };


    return (

        <div>
        <h2>Upload Record</h2>

        <form onSubmit={handleSubmit}>
            <input
                type="text" 
                name="title" 
                placeholder="Title" 
                value={record.title} 
                onChange={handleChange}
                required
            />
            <input
                type="text" 
                name="artist" 
                placeholder="Artist" 
                value={record.artist} 
                onChange={handleChange}
                required
            />
            <input
                type="number" 
                name="year" 
                placeholder="Year" 
                value={record.year} 
                onChange={handleChange}
                required
            />
            <input
                type="text" 
                name="genre" 
                placeholder="Genre" 
                value={record.genre} 
                onChange={handleChange}
                required
            />

            <button type="submit">Upload</button>
        </form>

        <p>{message}</p>
    </div>
  )
}

export default UploadRecord;