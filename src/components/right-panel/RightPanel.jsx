/* eslint-disable react/prop-types */
import { useState } from "react";
import PropTypes from "prop-types";
import {
  FiX,
  FiCheck,
  FiLayout,
  FiBook,
  FiCode,
  FiMonitor,
  FiCloud,
  FiStar,
} from "react-icons/fi";

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

const TemplatePanel = ({ applyTemplate, customizations }) => {
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const templates = [
    {
      id: "deedy-cv",
      name: "Deedy CV",
      sections: 3,
      features: [
        "One-Page Layout",
        "Print Friendly",
        "Minimalist Design",
        "Customizable via LaTeX",
      ],
      description:
        "Inspired by the famous Deedy CV, this template is perfect for software developers seeking a clean, modern, and highly readable résumé.",
      color: "bg-gradient-to-br from-gray-100 to-blue-100",
      icon: FiBook,
      preview: FiCode,
      badges: ["Responsive", "Open Source", "ATS Friendly"],
    },
    {
      id: "modern-cv",
      name: "Modern Developer CV",
      sections: 4,
      features: [
        "Clean Layout",
        "Interactive Timeline",
        "Downloadable PDF",
        "Editable Sections",
      ],
      description:
        "A sleek, modern résumé template that emphasizes clarity and ease-of-use, ideal for developers who want a professional look with a contemporary twist.",
      color: "bg-gradient-to-br from-green-50 to-teal-50",
      icon: FiMonitor,
      preview: FiCode,
      badges: ["Customizable", "ATS Optimized", "Responsive"],
    },
    {
      id: "creative-cv",
      name: "Creative Developer CV",
      sections: 5,
      features: [
        "Visual Timeline",
        "Project Highlights",
        "Skill Graphs",
        "Integrated Portfolio",
      ],
      description:
        "A creative résumé design that seamlessly integrates project showcases with a professional CV layout, perfect for developers who want to highlight both technical skills and creative flair.",
      color: "bg-gradient-to-br from-pink-50 to-red-50",
      icon: FiStar,
      preview: FiCloud,
      badges: ["Modern", "Interactive", "Unique Design"],
    },
    {
      id: "modern-single-column-cv",
      name: "Modern Single Column CV",
      sections: 5,
      features: [
        "Visual Timeline",
        "Project Highlights",
        "Skill Graphs",
        "Integrated Portfolio",
      ],
      description:
        "A creative résumé design that seamlessly integrates project showcases with a professional CV layout, perfect for developers who want to highlight both technical skills and creative flair.",
      color: "bg-gradient-to-br from-pink-50 to-red-50",
      icon: FiStar,
      preview: FiCloud,
      badges: ["Modern", "Interactive", "Unique Design"],
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

TemplatePanel.propTypes = {
  applyTemplate: PropTypes.func.isRequired,
  customizations: PropTypes.object.isRequired,
};

const RightPanel = ({ applyTemplate, customizations, mobile }) => {
  return (
    <div
      className={`${
        mobile
          ? ""
          : "hidden md:flex md:flex-col w-full md:w-48 h-full md:h-screen sticky top-0 bg-white border-l border-gray-100"
      }`}
    >
      <div className="p-3 pb-2 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Templates</h3>
        <p className="text-xs text-gray-500">
          Choose from professional layouts
        </p>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-3">
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
  mobile: PropTypes.bool,
};

export default RightPanel;
