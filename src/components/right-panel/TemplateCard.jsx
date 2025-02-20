import PropTypes from "prop-types";
import { FiCheck, FiLayout } from "react-icons/fi";

const TemplateCard = ({ template, isSelected, onClick, onPreview }) => {
  return (
    <div
      onClick={onClick}
      className={`group relative cursor-pointer transition-all duration-200 border rounded-xl p-4 flex flex-col ${
        isSelected
          ? "border-blue-500 shadow-lg bg-blue-50/50"
          : "border-gray-200 hover:border-blue-300 bg-white hover:bg-gray-50"
      }`}
    >
      <div
        className={`mb-3 rounded-lg overflow-hidden ${template.color} relative h-32`}
      >
        <template.icon className="w-full h-full opacity-10 p-6 transition-opacity group-hover:opacity-20" />
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <template.preview className="w-full h-full text-gray-700" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">
            {template.name}
          </h3>
          <p className="text-xs text-gray-500">{template.sections} sections</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPreview(template);
          }}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
        >
          <FiLayout className="w-5 h-5" />
        </button>
      </div>

      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full">
          <FiCheck className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};

TemplateCard.propTypes = {
  template: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    sections: PropTypes.number,
    features: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string,
    color: PropTypes.string,
    icon: PropTypes.elementType,
    preview: PropTypes.elementType,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onPreview: PropTypes.func.isRequired,
};

export default TemplateCard;
