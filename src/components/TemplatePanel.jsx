import { useState } from "react";
import PropTypes from "prop-types";
import { FiEye } from "react-icons/fi"; // For preview icon

const TemplatePanel = ({ applyTemplate, customizations }) => {
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const templates = [
    {
      id: "single-column",
      name: "Single Column",
      thumbnail: "https://via.placeholder.com/150?text=Single+Column",
      description: "A simple, linear layout.",
    },
    {
      id: "two-column",
      name: "Two Column",
      thumbnail: "https://via.placeholder.com/150?text=Two+Column",
      description: "A split layout with a sidebar.",
    },
    {
      id: "grid",
      name: "Grid Layout",
      thumbnail: "https://via.placeholder.com/150?text=Grid+Layout",
      description: "A flexible grid-based design.",
    },
  ];

  return (
    <div className="mb-6">
      {/* Header */}
      <h2 className="text-lg font-semibold mb-4">Resume Templates</h2>

      {/* Template List */}
      <div className="space-y-4">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => applyTemplate(template.id)}
            className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
              customizations.template === template.id
                ? "border-2 border-blue-500 bg-blue-50"
                : "hover:bg-gray-50"
            }`}
          >
            {/* Thumbnail */}
            <img
              src={template.thumbnail}
              alt={template.name}
              className="w-full h-32 object-cover rounded-md mb-2"
            />

            {/* Template Info */}
            <h3 className="font-medium">{template.name}</h3>
            <p className="text-sm text-gray-600">{template.description}</p>

            {/* Preview Button */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering parent click
                setPreviewTemplate(template);
              }}
              className="text-blue-500 hover:text-blue-600 transition-colors mt-2"
            >
              <FiEye className="inline-block mr-1" />
              Preview
            </button>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg relative max-w-md">
            {/* Close Button */}
            <button
              onClick={() => setPreviewTemplate(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>

            {/* Preview Content */}
            <h3 className="text-xl font-bold mb-2">{previewTemplate.name}</h3>
            <p className="text-gray-600">{previewTemplate.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Prop Types Validation
TemplatePanel.propTypes = {
  applyTemplate: PropTypes.func.isRequired,
  customizations: PropTypes.object.isRequired,
};

export default TemplatePanel;
