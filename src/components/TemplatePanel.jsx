import { useState } from "react";
import PropTypes from "prop-types";
import { FiEye } from "react-icons/fi";

const TemplatePanel = ({ applyTemplate, customizations }) => {
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const templates = [
    {
      id: "single-column",
      name: "Single Column",
      thumbnail: "https://via.placeholder.com/300x150?text=Single+Column",
      description: "A simple, linear layout.",
    },
    {
      id: "two-column",
      name: "Two Column",
      thumbnail: "https://via.placeholder.com/300x150?text=Two+Column",
      description: "A split layout with a sidebar.",
    },
    {
      id: "grid",
      name: "Grid Layout",
      thumbnail: "https://via.placeholder.com/300x150?text=Grid+Layout",
      description: "A flexible grid-based design.",
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Resume Templates</h2>
      <div className="space-y-6">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => applyTemplate(template.id)}
            className={`p-4 rounded-lg cursor-pointer transition-all duration-300 border ${
              customizations.template === template.id
                ? "border-blue-500 bg-blue-50"
                : "border-transparent hover:border-gray-300"
            }`}
          >
            <img
              src={template.thumbnail}
              alt={template.name}
              className="w-full h-32 object-cover rounded-md mb-3"
            />
            <h3 className="font-medium text-lg">{template.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{template.description}</p>
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
            <h3 className="text-2xl font-bold mb-2">{previewTemplate.name}</h3>
            <p className="text-gray-600">{previewTemplate.description}</p>
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
