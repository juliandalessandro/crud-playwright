import "../App.css";
import { useEffect } from "react";
import { useToast } from "../context/ToastContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const recordSchema = z.object({
  title: z.string().min(1, "Title cannot be empty"),
  artist: z.string().min(1, "Artist cannot be empty"),
  year: z
    .union([
      z.number({
        invalid_type_error: "Year must be a number",
      }),
      z.nan()
    ])
    .refine((val) => val !== undefined && !Number.isNaN(val), {
      message: "Year cannot be null",
    })
    .refine((val) => Number.isInteger(val), {
      message: "Year must be an integer",
    })
    .refine((val) => val >= 1600, {
      message: "Year must be greater than or equal to 1600",
    })
    .refine((val) => val <= new Date().getFullYear(), {
      message: `Year cannot be in the future`,
    }),
  genre: z.string().min(1, "Genre cannot be empty"),
  cover: z.string().min(1, "Cover cannot be empty")
  .refine((val) => {
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }},{
      message: "Cover must be a valid URL",
    })
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

  // If open record changes, reset form values
  useEffect(() => {
    reset(record || {});
  }, [record, reset]);

  if (!show || !record) return null;

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(record.id, data);
      showToast("Record updated successfully!", "success");
      onClose();
    } catch (err) {
      console.error(err);
      showToast("Error updating record", "error");
    }
  };

  return (
    <div className={`modal-overlay ${isClosing ? "closing" : ""}`} data-testid="edit-record-modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} data-testid="cancel-editRecord-button">
          ×
        </button>
        <h3 data-testid="edit-record-modal-title">Edit Record</h3>

        <form className="modal-form" onSubmit={handleSubmit(handleFormSubmit)}>
          <input className="form-input" placeholder="Title" data-testid="title-editRecord-input" {...register("title")} />
          {errors.title && <span style={{ color: "red" }} data-testid="title-editRecord-input-error">{errors.title.message}</span>}

          <input className="form-input" placeholder="Artist" data-testid="artist-editRecord-input" {...register("artist")} />
          {errors.artist && <span style={{ color: "red" }} data-testid="artist-editRecord-input-error">{errors.artist.message}</span>}

          <input
            className="form-input"
            type="number"
            placeholder="Year"
            data-testid="year-editRecord-input"
            {...register("year", { valueAsNumber: true })}
          />
          {errors.year && <span style={{ color: "red" }} data-testid="year-editRecord-input-error">{errors.year.message}</span>}

          <input className="form-input" placeholder="Genre" data-testid="genre-editRecord-input" {...register("genre")} />
          {errors.genre && <span style={{ color: "red" }} data-testid="genre-editRecord-input-error">{errors.genre.message}</span>}

          <input className="form-input" placeholder="Cover URL" data-testid="cover-editRecord-input" {...register("cover")} />
          {errors.cover && <span style={{ color: "red" }} data-testid="cover-editRecord-input-error">{errors.cover.message}</span>}

          <button className="btn-submit" type="submit" data-testid="submit-editRecord-button" disabled={!isDirty || isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditRecordModal;
