"use client";
// import { useModal } from "@/context/ModalContext";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useModal } from "@/context/ModalContext";

export default function GlobalModal() {
  const { open, content, closeModal } = useModal();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open && mounted) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.documentElement.style.overflow = "unset";
      document.body.style.overflow = "unset";
    };
  }, [open, mounted]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed top-0 left-0 right-0 bottom-0 bg-black/70 flex items-center justify-center z-50"
      onClick={closeModal}
      style={{ position: 'fixed', inset: 0 }}
    >
      <div
        className="bg-white rounded-lg p-10 relative max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-5 right-5 text-xl hover:text-gray-600 transition-colors"
          onClick={closeModal}
        >
          ✕
        </button>

        {content}
      </div>
    </div>,
    document.body
  );
}