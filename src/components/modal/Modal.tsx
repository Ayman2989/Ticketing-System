interface ModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (x: boolean) => void;
  title: string;
  message: string;
  onConfirm?: () => void;
}

export const Modal: React.FC<ModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  title,
  message,
  onConfirm,
}) => {
  return (
    <>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-900 bg-opacity-10 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 transform transition-transform scale-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {title}
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                onClick={() => {
                  if (onConfirm) {
                    onConfirm(); // Call the confirmation handler
                  }
                  setIsModalOpen(false); // Close modal after confirmation
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
