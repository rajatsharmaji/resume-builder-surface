/* eslint-disable react/prop-types */
import { useState } from "react";
import PropTypes from "prop-types";
import {
  FiX,
  FiCheck,
  FiLayout,
  FiGrid,
  FiSidebar,
  FiBox,
  FiColumns,
  FiType,
  FiImage,
  FiList,
  FiSliders,
} from "react-icons/fi";

const TemplatePreviewModal = ({ template, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl m-4 overflow-hidden">
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
          <div className="flex gap-2">
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
          <h3 className="font-semibold text-gray-900">{template.name}</h3>
          <p className="text-sm text-gray-500">{template.sections} sections</p>
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

const TemplatePanel = ({ applyTemplate, customizations }) => {
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const templates = [
    {
      id: "portfolio",
      name: "Portfolio",
      sections: 5,
      features: ["Hero", "Projects", "Skills", "Testimonials", "Contact"],
      description: "Modern portfolio showcase with project highlights",
      color: "bg-gradient-to-br from-purple-500 to-blue-500",
      icon: FiLayout,
      preview: FiGrid,
    },
    {
      id: "blog",
      name: "Blog Layout",
      sections: 4,
      features: [
        "Featured Post",
        "Categories",
        "Recent Articles",
        "Newsletter",
      ],
      description: "Clean content-focused blog layout",
      color: "bg-gradient-to-br from-green-500 to-cyan-500",
      icon: FiSidebar,
      preview: FiList,
    },
    {
      id: "ecommerce",
      name: "E-Commerce",
      sections: 6,
      features: [
        "Product Grid",
        "Filters",
        "Featured Items",
        "Cart",
        "Reviews",
      ],
      description: "Online store template with product showcase",
      color: "bg-gradient-to-br from-orange-500 to-red-500",
      icon: FiBox,
      preview: FiColumns,
    },
    {
      id: "landing",
      name: "Landing Page",
      sections: 4,
      features: ["Hero", "Features", "Pricing", "CTA"],
      description: "High-conversion marketing landing page",
      color: "bg-gradient-to-br from-pink-500 to-rose-500",
      icon: FiType,
      preview: FiSliders,
    },
    {
      id: "gallery",
      name: "Photo Gallery",
      sections: 3,
      features: ["Fullscreen Grid", "Lightbox", "Categories"],
      description: "Visual-focused image gallery layout",
      color: "bg-gradient-to-br from-yellow-500 to-amber-500",
      icon: FiImage,
      preview: FiGrid,
    },
  ];

  return (
    <div className="space-y-4 p-2">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          isSelected={customizations.template === template.id}
          onClick={() => applyTemplate(template.id)}
          onPreview={setPreviewTemplate}
        />
      ))}

      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
        />
      )}
    </div>
  );
};

const RightPanel = ({ applyTemplate, customizations }) => {
  return (
    <div className="w-80 h-screen sticky top-0 bg-white border-l border-gray-100 flex flex-col">
      <div className="p-6 pb-4 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-1">Templates</h3>
        <p className="text-sm text-gray-500">
          Choose from professional layouts
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <TemplatePanel
          applyTemplate={applyTemplate}
          customizations={customizations}
        />
      </div>
    </div>
  );
};

RightPanel.propTypes = {
  applyTemplate: PropTypes.func.isRequired,
  customizations: PropTypes.object.isRequired,
};

export default RightPanel;
