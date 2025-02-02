import { useState, useRef } from "react";
import {
  FiLayout,
  FiUser,
  FiBriefcase,
  FiBook,
  FiCode,
  FiAward,
  FiFileText,
} from "react-icons/fi";
import useResume from "../hooks/useResume"; // Assuming this hook manages resume state
import ElementsPanel from "../components/ElementsPanel";
import LayersPanel from "../components/LayersPanel";
import PreviewPanel from "../components/PreviewPanel";
import TemplatePanel from "../components/TemplatePanel";

const ResumeBuilder = () => {
  // State management for sections and template selection
  const { sections, addSection, moveSection, removeSection } = useResume();
  const [contextMenu, setContextMenu] = useState(null);
  const [currentTemplate, setCurrentTemplate] = useState("classic"); // Default template
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

  // Handle right-click to show context menu
  const handleRightClick = (e, sectionId) => {
    e.preventDefault();
    setContextMenu({ x: e.pageX, y: e.pageY, sectionId });
  };

  // Handle drag-and-drop in the Preview Panel
  const handleDrop = (e) => {
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
      const nodeMidpoint = nodeRect.top - previewRect.top + nodeRect.height / 2;
      if (dropY < nodeMidpoint) {
        insertIndex = i;
        break;
      }
    }

    addSection(sectionId, insertIndex);
  };

  // Handle drag start for draggable elements
  const handleDragStart = (e, sectionId) => {
    e.dataTransfer.setData("sectionId", sectionId);
  };

  // Apply a selected template
  const applyTemplate = (templateId) => {
    setCurrentTemplate(templateId);
    console.log(`Applied template: ${templateId}`);
    // You can implement logic here to dynamically update the resume styles
  };

  return (
    <div className="min-h-screen bg-gray-50 flex gap-6 font-sans">
      {/* Left Panel: Fixed Controls */}
      <div className="w-72 sticky top-0 h-screen flex flex-col gap-4 overflow-hidden">
        {/* Elements Panel */}
        <ElementsPanel
          sectionTypes={sectionTypes}
          addSection={addSection}
          handleDragStart={handleDragStart}
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
        handleRightClick={handleRightClick}
        handleDrop={handleDrop}
        currentTemplate={currentTemplate} // Pass the selected template
      />

      {/* Right Panel: Templates */}
      <TemplatePanel applyTemplate={applyTemplate} />
    </div>
  );
};

export default ResumeBuilder;
