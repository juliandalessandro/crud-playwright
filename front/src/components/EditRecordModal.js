import "../App.css";
import { useEffect } from "react";
import { useToast } from "../context/ToastContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ✅ Schema Zod para validar edición
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

function EditRecordModal({ show, isClosing, record, onClose, onSubmit }) {
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    resolver: zodResolver(recordSchema),
    defaultValues: record || {},
  });

  // Si cambia el record abierto, reseteamos los valores del formulario
  useEffect(() => {
    reset(record || {});
  }, [record, reset]);

  if (!show || !record) return null;

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(record.id, data); // pasamos el id y los datos validados
      showToast("Record updated successfully!", "success");
      onClose();
    } catch (err) {
      console.error(err);
      showToast("Error updating record", "error");
    }
  };

  return (
    <div className={`modal-overlay ${isClosing ? "closing" : ""}`} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h3>Edit Record</h3>

        <form className="modal-form" onSubmit={handleSubmit(handleFormSubmit)}>
          <input className="form-input" placeholder="Title" {...register("title")} />
          {errors.title && <span style={{ color: "red" }}>{errors.title.message}</span>}

          <input className="form-input" placeholder="Artist" {...register("artist")} />
          {errors.artist && <span style={{ color: "red" }}>{errors.artist.message}</span>}

          <input
            className="form-input"
            type="number"
            placeholder="Year"
            {...register("year", { valueAsNumber: true })}
          />
          {errors.year && <span style={{ color: "red" }}>{errors.year.message}</span>}

          <input className="form-input" placeholder="Genre" {...register("genre")} />
          {errors.genre && <span style={{ color: "red" }}>{errors.genre.message}</span>}

          <input className="form-input" placeholder="Cover URL" {...register("cover")} />
          {errors.cover && <span style={{ color: "red" }}>{errors.cover.message}</span>}

          <button className="btn-submit" type="submit" disabled={!isDirty || isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditRecordModal;
