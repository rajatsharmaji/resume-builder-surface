// src/components/AIPreviewModal.jsx
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

const AIPreviewModal = ({ isOpen, aiResult, onAdd, onCancel }) => {
  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
      {/* Modal */}
      <div className="bg-white rounded-lg p-6 z-10 max-w-sm mx-auto">
        <p className="mb-4 text-gray-700">{aiResult}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onAdd}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

AIPreviewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  aiResult: PropTypes.string.isRequired,
  onAdd: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AIPreviewModal;
