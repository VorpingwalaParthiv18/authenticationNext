"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  isClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, isClose, title, children }: ModalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.documentElement.style.overflow = "unset";
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div className="bg-black rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
