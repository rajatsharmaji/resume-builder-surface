import { useRef, useState } from "react";
import useResume from "../hooks/useResume";
import ElementsPanel from "../components/left-panel/ElementsPanel";
import LayersPanel from "../components/left-panel/LayersPanel";
import PreviewPanel from "../components/preview-panel/PreviewPanel";
import RightPanel from "../components/right-panel/RightPanel";
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
  const [currentTemplate, setCurrentTemplate] = useState("default");
  const [customizations, setCustomizations] = useState({
    font: "Roboto, sans-serif",
    fontSize: 16,
    primaryColor: "#007BFF",
    secondaryColor: "#F8F9FA",
    spacing: "1rem",
    textColor: "#000000",
    backgroundColor: "#ffffff",
  });
  const [finalMode, setFinalMode] = useState(false);
  const resumeRef = useRef(null);

  // Define section types for the Elements Panel
  const sectionTypes = [
    {
      id: "header",
      label: "Header",
      icon: <FiUser />,
      color: "bg-red-100",
      tooltip: "Add a header section to your resume.",
    },
    {
      id: "about",
      label: "About",
      icon: <FiFileText />,
      color: "bg-blue-100",
      tooltip: "Introduce yourself with an about section.",
    },
    {
      id: "experience",
      label: "Experience",
      icon: <FiBriefcase />,
      color: "bg-green-100",
      tooltip: "Highlight your professional experience.",
    },
    {
      id: "education",
      label: "Education",
      icon: <FiBook />,
      color: "bg-yellow-100",
      tooltip: "Showcase your educational background.",
    },
    {
      id: "skills",
      label: "Skills",
      icon: <FiCode />,
      color: "bg-purple-100",
      tooltip: "List your key skills and competencies.",
    },
    {
      id: "projects",
      label: "Projects",
      icon: <FiAward />,
      color: "bg-indigo-100",
      tooltip: "Describe your notable projects.",
    },
    {
      id: "certifications",
      label: "Certifications",
      icon: <FiAward />,
      color: "bg-pink-100",
      tooltip: "Display your certifications and achievements.",
    },
    {
      id: "footer",
      label: "Footer",
      icon: <FiLayout />,
      color: "bg-red-100",
      tooltip: "Add a footer section to your resume.",
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

  // Prevent moving locked sections
  const handleMoveSection = (draggedId, targetIndex) => {
    const draggedSection = sections.find((s) => s.id === draggedId);
    if (draggedSection) {
      if (draggedSection.type === "header") {
        alert("Header must always remain at the top.");
        return;
      }
      if (draggedSection.type === "footer") {
        alert("Footer must always remain at the bottom.");
        return;
      }
    }
    moveSection(draggedId, targetIndex);
  };

  // Handle drop when adding new sections
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const sectionId = e.dataTransfer.getData("sectionId");
    if (!sectionId) return;

    let insertIndex;
    if (sectionId === "header") {
      insertIndex = 0;
    } else if (sectionId === "footer") {
      insertIndex = sections.length;
    } else {
      const previewRect = resumeRef.current.getBoundingClientRect();
      const dropY = e.clientY - previewRect.top;
      const sectionNodes = Array.from(resumeRef.current.children);
      insertIndex = sections.length;
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
    }
    addSection(sectionId, insertIndex);
  };

  // Handle right-click to show context menu (only in edit mode)
  const handleRightClick = (e, id) => {
    e.preventDefault();
    if (!finalMode) {
      setContextMenu({ x: e.pageX, y: e.pageY, sectionId: id });
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Panel */}
      <div className="w-1/5 border-r border-gray-200 p-4">
        <ElementsPanel
          sectionTypes={sectionTypes}
          onDragStart={(id, e) => e.dataTransfer.setData("sectionId", id)}
        />
        <LayersPanel
          sections={sections}
          moveSection={handleMoveSection}
          removeSection={removeSection}
        />
      </div>

      {/* Middle Panel: Resume Preview */}
      <div className="flex-1 p-4 relative" ref={resumeRef}>
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setFinalMode((prev) => !prev)}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white shadow-sm text-gray-800 hover:bg-gray-100 transition-colors"
          >
            {finalMode ? "Switch to Edit Mode" : "Generate"}
          </button>
        </div>
        <PreviewPanel
          resumeRef={resumeRef}
          sections={sections}
          moveSection={handleMoveSection}
          removeSection={removeSection}
          contextMenu={contextMenu}
          setContextMenu={setContextMenu}
          handleRightClick={handleRightClick}
          handleDrop={handleDrop}
          currentTemplate={currentTemplate}
          customizations={customizations}
          finalMode={finalMode}
        />
      </div>

      {/* Right Panel */}
      <RightPanel
        customizations={customizations}
        updateCustomizations={updateCustomizations}
        applyTemplate={applyTemplate}
      />
    </div>
  );
};

export default ResumeBuilder;
