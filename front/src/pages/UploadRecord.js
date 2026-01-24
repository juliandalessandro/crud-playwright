import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { createRecord } from "../services/recordsApi";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "../App.css";
import Navbar from "../components/Navbar";

const recordSchema = z.object({
  title: z.string().min(1, "Title is required"),
  artist: z.string().min(1, "Artist is required"),
  year: z
    .union([
      z.number({
        invalid_type_error: "Year must be a number",
      }),
      z.nan()
    ])
    .refine((val) => val !== undefined && !Number.isNaN(val), {
      message: "Year is required",
    })
    .refine((val) => Number.isInteger(val), {
      message: "Year must be an integer",
    })
    .refine((val) => val >= 1900, {
      message: "Year must be 1900 or later",
    })
    .refine((val) => val <= new Date().getFullYear(), {
      message: `Year cannot be later than ${new Date().getFullYear()}`,
    }),
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
            data-testid="title-uploadRecord-input"
            {...register("title")}
          />
          {errors.title && <span style={{ color: "red" }} data-testid="record-upload-title-error">{errors.title.message}</span>}

          <input
            className="form-input"
            placeholder="Artist"
            data-testid="artist-uploadRecord-input"
            {...register("artist")}
          />
          {errors.artist && <span style={{ color: "red" }} data-testid="record-upload-artist-error">{errors.artist.message}</span>}

          <input
            className="form-input"
            type="number"
            placeholder="Year"
            data-testid="year-uploadRecord-input"
            {...register("year", { valueAsNumber: true })}
          />
          {errors.year && <span style={{ color: "red" }} data-testid="record-upload-year-error">{errors.year.message}</span>}

          <input
            className="form-input"
            placeholder="Genre"
            data-testid="genre-uploadRecord-input"
            {...register("genre")}
          />
          {errors.genre && <span style={{ color: "red" }} data-testid="record-upload-genre-error">{errors.genre.message}</span>}

          <input
            className="form-input"
            placeholder="Cover URL"
            data-testid="coverURL-uploadRecord-input"
            {...register("cover")}
          />
          {errors.cover && <span style={{ color: "red" }} data-testid="record-upload-coverURL-error">{errors.cover.message}</span>}

          <button className="btn-submit" type="submit" disabled={isSubmitting} data-testid="uploadRecord-button">
            {isSubmitting ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
}
