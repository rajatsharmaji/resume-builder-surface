import { useState } from "react";
import PropTypes from "prop-types";
import { FiEye } from "react-icons/fi";
import { FaListAlt, FaColumns, FaTh } from "react-icons/fa";

const TemplatePanel = ({ applyTemplate, customizations }) => {
  const [previewTemplate, setPreviewTemplate] = useState(null);

  // Define templates with icons replacing the thumbnail images.
  const templates = [
    {
      id: "single-column",
      name: "Single Column",
      icon: <FaListAlt size={48} className="mx-auto text-gray-500" />,
      description: "A simple, linear layout.",
    },
    {
      id: "two-column",
      name: "Two Column",
      icon: <FaColumns size={48} className="mx-auto text-gray-500" />,
      description: "A split layout with a sidebar.",
    },
    {
      id: "grid",
      name: "Grid Layout",
      icon: <FaTh size={48} className="mx-auto text-gray-500" />,
      description: "A flexible grid-based design.",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Resume Templates</h2>

      {/* Template Cards */}
      <div className="grid grid-cols-1 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => applyTemplate(template.id)}
            className={`p-4 rounded-lg cursor-pointer transition-all duration-300 border shadow-sm ${
              customizations.template === template.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="mb-3">{template.icon}</div>
            <h3 className="font-medium text-lg text-gray-800 text-center">
              {template.name}
            </h3>
            <p className="text-sm text-gray-600 text-center mb-2">
              {template.description}
            </p>
            <div className="flex justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewTemplate(template);
                }}
                className="flex items-center text-blue-500 hover:text-blue-600 transition-colors text-sm font-medium"
              >
                <FiEye className="mr-1" /> Preview
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg relative max-w-md w-full">
            <button
              onClick={() => setPreviewTemplate(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
            <div className="text-center mb-4">{previewTemplate.icon}</div>
            <h3 className="text-2xl font-bold mb-2 text-center">
              {previewTemplate.name}
            </h3>
            <p className="text-gray-600 text-center">
              {previewTemplate.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

TemplatePanel.propTypes = {
  applyTemplate: PropTypes.func.isRequired,
  customizations: PropTypes.object.isRequired,
};

export default TemplatePanel;
