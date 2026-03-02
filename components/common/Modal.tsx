interface ModalProps {
  isOpen: boolean;
  isClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, isClose, title, children }: ModalProps) => {
  console.log({ isOpen, title });
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center w-screen bg-opacity-50 bg-red-500">
      <div className=" ">
        <div className="bg-black rounded-lg p-6 w-96">
          <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
