import { useToast } from "../context/ToastContext";

function ToastContainer() {
  const { toast } = useToast();
  if (!toast.message) return null;

  const className =
    toast.type === "success"
      ? "toast-message-edit-upload"
      : toast.type === "error" || "delete"
      ? "toast-message"
      : "toast-message-edit-upload";

  return <div className={className}>{toast.message}</div>;
}

export default ToastContainer;
