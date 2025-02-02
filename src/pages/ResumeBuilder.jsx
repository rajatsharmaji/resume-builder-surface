import { useState, useRef } from "react";
import useResume from "../hooks/useResume";
import ElementsPanel from "../components/ElementsPanel";
import LayersPanel from "../components/LayersPanel";
import PreviewPanel from "../components/PreviewPanel";
import TemplatePanel from "../components/TemplatePanel";
import {
  FiAward,
  FiBook,
  FiBriefcase,
  FiCode,
  FiFileText,
  FiLayout,
  FiUser,
} from "react-icons/fi";

const ResumeBuilder = () => {
  const { sections, addSection, moveSection, removeSection } = useResume();
  const [contextMenu, setContextMenu] = useState(null);
  const [currentTemplate, setCurrentTemplate] = useState("single-column");
  const [customizations, setCustomizations] = useState({
    font: "Roboto",
    fontSize: "16px",
    primaryColor: "#007BFF",
    secondaryColor: "#F8F9FA",
    spacing: "1rem",
  });
  const resumeRef = useRef(null);

  // Define section types for the Elements Panel
  const sectionTypes = [
    {
      id: "header",
      label: "Header",
      icon: <FiLayout className="w-5 h-5" />,
      color: "bg-red-100",
    },
    {
      id: "about",
      label: "About",
      icon: <FiUser className="w-5 h-5" />,
      color: "bg-blue-100",
    },
    {
      id: "experience",
      label: "Experience",
      icon: <FiBriefcase className="w-5 h-5" />,
      color: "bg-green-100",
    },
    {
      id: "education",
      label: "Education",
      icon: <FiBook className="w-5 h-5" />,
      color: "bg-yellow-100",
    },
    {
      id: "skills",
      label: "Skills",
      icon: <FiCode className="w-5 h-5" />,
      color: "bg-purple-100",
    },
    {
      id: "projects",
      label: "Projects",
      icon: <FiFileText className="w-5 h-5" />,
      color: "bg-indigo-100",
    },
    {
      id: "certifications",
      label: "Certifications",
      icon: <FiAward className="w-5 h-5" />,
      color: "bg-pink-100",
    },
  ];

  // Handle template selection
  const applyTemplate = (templateId) => {
    setCurrentTemplate(templateId);
    console.log(`Applied template: ${templateId}`);
  };

  // Update customizations
  const updateCustomizations = (key, value) => {
    setCustomizations((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex gap-6 font-sans">
      {/* Left Panel: Fixed Controls */}
      <div className="w-72 sticky top-0 h-screen flex flex-col gap-4 overflow-hidden">
        {/* Elements Panel */}
        <ElementsPanel
          sectionTypes={sectionTypes}
          addSection={addSection}
          handleDragStart={(e, id) => e.dataTransfer.setData("sectionId", id)}
        />
        {/* Layers Panel */}
        <LayersPanel
          sections={sections}
          moveSection={moveSection}
          removeSection={removeSection}
        />
      </div>

      {/* Middle Panel: Preview */}
      <PreviewPanel
        resumeRef={resumeRef}
        sections={sections}
        moveSection={moveSection}
        removeSection={removeSection}
        contextMenu={contextMenu}
        setContextMenu={setContextMenu}
        handleRightClick={(e, id) => {
          e.preventDefault();
          setContextMenu({ x: e.pageX, y: e.pageY, sectionId: id });
        }}
        handleDrop={(e) => {
          e.preventDefault();
          const sectionId = e.dataTransfer.getData("sectionId");
          if (!sectionId) return;

          const previewRect = resumeRef.current.getBoundingClientRect();
          const dropY = e.clientY - previewRect.top;

          const sectionNodes = Array.from(resumeRef.current.children);
          let insertIndex = sections.length; // Default: append to end

          for (let i = 0; i < sectionNodes.length; i++) {
            const node = sectionNodes[i];
            const nodeRect = node.getBoundingClientRect();
            const nodeMidpoint =
              nodeRect.top - previewRect.top + nodeRect.height / 2;
            if (dropY < nodeMidpoint) {
              insertIndex = i;
              break;
            }
          }

          addSection(sectionId, insertIndex);
        }}
        currentTemplate={currentTemplate}
        customizations={customizations}
      />

      {/* Right Panel: Templates */}
      <TemplatePanel
        applyTemplate={applyTemplate}
        customizations={customizations}
        updateCustomizations={updateCustomizations}
      />
    </div>
  );
};

export default ResumeBuilder;
