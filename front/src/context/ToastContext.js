import { createContext, useState, useContext, useCallback } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ message: "", type: "" });

  const showToast = useCallback((message, type = "default", duration = 2500) => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), duration);
  }, []);

  return (
    <ToastContext.Provider value={{ toast, showToast }}>
      {children}
    </ToastContext.Provider>
  );
}

// Custom hook para usar más fácil
export function useToast() {
  return useContext(ToastContext);
}