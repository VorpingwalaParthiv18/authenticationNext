"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type ModalContextType = {
  open: boolean;
  content: ReactNode;
  openModal: (component: ReactNode) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);

  const openModal = (component: ReactNode) => {
    setContent(component);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setContent(null);
  };

  return (
    <ModalContext.Provider value={{ open, content, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be inside ModalProvider");
  return context;
};