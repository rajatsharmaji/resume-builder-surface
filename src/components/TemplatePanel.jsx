/* eslint-disable react/prop-types */
import { useState } from "react";

const TemplatePanel = ({ applyTemplate }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Mock template data
  const templates = [
    {
      id: "classic",
      name: "Classic",
      thumbnail: "https://via.placeholder.com/150?text=Classic+Resume",
      description: "A timeless and professional design.",
    },
    {
      id: "modern",
      name: "Modern",
      thumbnail: "https://via.placeholder.com/150?text=Modern+Resume",
      description: "A sleek and contemporary layout.",
    },
    {
      id: "minimalist",
      name: "Minimalist",
      thumbnail: "https://via.placeholder.com/150?text=Minimalist+Resume",
      description: "Clean and simple for maximum impact.",
    },
    {
      id: "creative",
      name: "Creative",
      thumbnail: "https://via.placeholder.com/150?text=Creative+Resume",
      description: "Bold and artistic for creative fields.",
    },
  ];

  const handleTemplateClick = (templateId) => {
    setSelectedTemplate(templateId);
    applyTemplate(templateId); // Pass the selected template ID to the parent
  };

  return (
    <div className="w-72 flex flex-col gap-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-screen sticky top-0">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 px-4 pt-4">
          Resume Templates
        </h2>
        <div className="overflow-y-auto flex-1 px-4 pb-4 space-y-4">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => handleTemplateClick(template.id)}
              className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                selectedTemplate === template.id
                  ? "border-2 border-blue-500 bg-blue-50"
                  : "hover:bg-gray-50"
              }`}
            >
              <img
                src={template.thumbnail}
                alt={template.name}
                className="w-full h-32 object-cover rounded-md mb-2"
              />
              <h3 className="text-sm font-medium text-gray-800">
                {template.name}
              </h3>
              <p className="text-xs text-gray-500">{template.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplatePanel;
