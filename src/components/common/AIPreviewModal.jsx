// src/components/AIPreviewModal.jsx
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

const AIPreviewModal = ({ isOpen, aiResult, onAdd, onCancel }) => {
  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Animated Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity animate-fadeIn" />

      {/* Card-like Modal with Animation */}
      <div className="relative bg-white rounded-xl p-8 z-10 max-w-md w-full mx-4 shadow-2xl transform transition-all animate-cardIn">
        {/* Card Corner Accents */}
        <div className="absolute -top-2 -left-2 w-5 h-5 border-t-4 border-l-4 border-blue-500 rounded-tl-xl" />
        <div className="absolute -bottom-2 -right-2 w-5 h-5 border-b-4 border-r-4 border-blue-500 rounded-br-xl" />

        {/* Content */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
            <span className="mr-2">✨</span>AI Preview
          </h3>
          <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
            {aiResult}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 text-gray-600 hover:text-gray-800 transition-colors font-medium rounded-lg hover:bg-gray-100 active:bg-gray-200 border border-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onAdd}
            className="px-5 py-2.5 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all hover:shadow-lg active:scale-[0.98] border border-blue-600"
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
