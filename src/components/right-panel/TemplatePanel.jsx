import { useState } from "react";
import PropTypes from "prop-types";
import { FiBook, FiCode, FiMonitor, FiCloud, FiStar } from "react-icons/fi";
import TemplatePreviewModal from "./TemplatePreviewModal";
import TemplateCard from "./TemplateCard";

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

export default TemplatePanel;
