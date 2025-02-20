import PropTypes from "prop-types";
import { FiX } from "react-icons/fi";

const TemplatePreviewModal = ({ template, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <FiX className="w-6 h-6 text-gray-600" />
        </button>
        <div className="p-8">
          <div className="mb-6">
            <div
              className={`p-6 rounded-xl ${template.color} relative h-48 flex items-center justify-center`}
            >
              <template.icon className="w-24 h-24 text-white opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 p-4 rounded-lg shadow-lg">
                  <template.preview className="w-32 h-32 text-gray-800" />
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {template.name}
          </h3>
          <p className="text-gray-600 mb-4">{template.description}</p>
          <div className="flex flex-wrap gap-2">
            {template.features.map((feature, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

TemplatePreviewModal.propTypes = {
  template: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    color: PropTypes.string,
    icon: PropTypes.elementType,
    preview: PropTypes.elementType,
    features: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default TemplatePreviewModal;
