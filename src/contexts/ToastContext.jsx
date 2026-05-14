"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [confirmModal, setConfirmModal] = useState(null);

  const showToast = useCallback((message, type = "success", duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showConfirm = useCallback((title, message, onConfirm, onCancel = null) => {
    setConfirmModal({
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmModal(null);
      },
      onCancel: () => {
        if (onCancel) onCancel();
        setConfirmModal(null);
      },
    });
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, showConfirm }}>
      {children}
      
      {/* Toasts Container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center justify-between gap-3 min-w-[300px] max-w-md p-4 rounded-xl shadow-lg border pointer-events-auto transform transition-all duration-300 translate-x-0 opacity-100 ${
              toast.type === "success"
                ? "bg-white border-[#e6d1c7] text-[#2b1d19]"
                : toast.type === "error"
                  ? "bg-red-50 border-red-200 text-red-800"
                  : "bg-blue-50 border-blue-200 text-blue-800"
            }`}
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            <div className="flex items-center gap-3">
              {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-green-600" />}
              {toast.type === "error" && <AlertCircle className="w-5 h-5 text-red-600" />}
              {toast.type === "info" && <Info className="w-5 h-5 text-blue-600" />}
              <p className="text-sm font-semibold">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Confirm Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div 
            className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#2b1d19] mb-2">{confirmModal.title}</h3>
              <p className="text-sm text-[#524342] leading-relaxed">{confirmModal.message}</p>
            </div>
            <div className="bg-[#fafafa] px-6 py-4 border-t border-[#f0e2d9] flex justify-end gap-3">
              <button
                onClick={confirmModal.onCancel}
                className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmModal.onConfirm}
                className="px-5 py-2.5 rounded-lg bg-[#ef4444] hover:bg-[#dc2626] text-white text-sm font-semibold transition-colors shadow-sm"
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};
