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

  const sectionTypes = [
    { id: "header", label: "Header", icon: <FiUser />, color: "bg-red-100" },
    { id: "about", label: "About", icon: <FiFileText />, color: "bg-blue-100" },
    {
      id: "experience",
      label: "Experience",
      icon: <FiBriefcase />,
      color: "bg-green-100",
    },
    {
      id: "education",
      label: "Education",
      icon: <FiBook />,
      color: "bg-yellow-100",
    },
    { id: "skills", label: "Skills", icon: <FiCode />, color: "bg-purple-100" },
    {
      id: "projects",
      label: "Projects",
      icon: <FiAward />,
      color: "bg-indigo-100",
    },
    {
      id: "certifications",
      label: "Certifications",
      icon: <FiAward />,
      color: "bg-pink-100",
    },
    { id: "footer", label: "Footer", icon: <FiLayout />, color: "bg-red-100" },
  ];

  const handleDrop = (e) => {
    e.preventDefault();
    const existingSectionId = e.dataTransfer.getData(
      "application/existing-section"
    );
    const newSectionId = e.dataTransfer.getData("sectionId");

    const previewRect = resumeRef.current.getBoundingClientRect();
    const dropY = e.clientY - previewRect.top;
    const sectionNodes = Array.from(resumeRef.current.children);
    let insertIndex = sections.length;

    for (let i = 0; i < sectionNodes.length; i++) {
      const node = sectionNodes[i];
      const nodeRect = node.getBoundingClientRect();
      const nodeMidpoint = nodeRect.top - previewRect.top + nodeRect.height / 2;
      if (dropY < nodeMidpoint) {
        insertIndex = i;
        break;
      }
    }

    // Adjust for header/footer
    const headerIndex = sections.findIndex((s) => s.type === "header");
    const footerIndex = sections.findIndex((s) => s.type === "footer");

    if (headerIndex !== -1 && insertIndex === 0) insertIndex = 1;
    if (footerIndex !== -1 && insertIndex >= footerIndex)
      insertIndex = footerIndex - 1;

    if (existingSectionId) {
      const draggedSection = sections.find((s) => s.id === existingSectionId);
      if (!draggedSection) return;
      if (["header", "footer"].includes(draggedSection.type)) return;
      moveSection(existingSectionId, insertIndex);
    } else if (newSectionId) {
      addSection(newSectionId, insertIndex);
    }
  };

  const handleRightClick = (e, id) => {
    e.preventDefault();
    if (!finalMode) setContextMenu({ x: e.pageX, y: e.pageY, sectionId: id });
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/5 border-r border-gray-200 p-4">
        <ElementsPanel
          sectionTypes={sectionTypes}
          addSection={addSection}
          handleDragStart={(e, id) => e.dataTransfer.setData("sectionId", id)}
        />
        <LayersPanel
          sections={sections}
          moveSection={moveSection}
          removeSection={removeSection}
        />
      </div>

      <div className="flex-1 p-4 relative" ref={resumeRef}>
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setFinalMode((prev) => !prev)}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white shadow-sm text-gray-800 hover:bg-gray-100"
          >
            {finalMode ? "Switch to Edit Mode" : "Generate"}
          </button>
        </div>
        <PreviewPanel
          resumeRef={resumeRef}
          sections={sections}
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

      <RightPanel
        customizations={customizations}
        updateCustomizations={setCustomizations}
        applyTemplate={setCurrentTemplate}
      />
    </div>
  );
};

export default ResumeBuilder;
