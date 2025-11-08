import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { createRecord } from "../services/recordsApi";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "../App.css";
import Navbar from "../components/Navbar";

// ✅ Schema Zod para validar el formulario
const recordSchema = z.object({
  title: z.string().min(1, "Title is required"),
  artist: z.string().min(1, "Artist is required"),
  year: z
    .number({ invalid_type_error: "Year must be a number" })
    .int("Year must be an integer")
    .min(1900, "Year must be 1900 or later")
    .max(new Date().getFullYear(), `Year cannot be later than ${new Date().getFullYear()}`),
  genre: z.string().min(1, "Genre is required"),
  cover: z.string().url("Cover must be a valid URL"),
});

export default function UploadRecord() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: zodResolver(recordSchema),
    defaultValues: {
      title: "",
      artist: "",
      year: "",
      genre: "",
      cover: ""
    }
  });

  const onSubmit = async (data) => {
    try {
      await createRecord(data);
      showToast("Record uploaded successfully!", "success");
      reset();
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      showToast("Error uploading record", "error");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="form-container">
        <h2>Upload Record</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            className="form-input"
            placeholder="Title"
            {...register("title")}
          />
          {errors.title && <span style={{ color: "red" }}>{errors.title.message}</span>}

          <input
            className="form-input"
            placeholder="Artist"
            {...register("artist")}
          />
          {errors.artist && <span style={{ color: "red" }}>{errors.artist.message}</span>}

          <input
            className="form-input"
            type="number"
            placeholder="Year"
            {...register("year", { valueAsNumber: true })}
          />
          {errors.year && <span style={{ color: "red" }}>{errors.year.message}</span>}

          <input
            className="form-input"
            placeholder="Genre"
            {...register("genre")}
          />
          {errors.genre && <span style={{ color: "red" }}>{errors.genre.message}</span>}

          <input
            className="form-input"
            placeholder="Cover URL"
            {...register("cover")}
          />
          {errors.cover && <span style={{ color: "red" }}>{errors.cover.message}</span>}

          <button className="btn-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
}
