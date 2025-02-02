import { useState, useRef } from "react";
import useResume from "../hooks/useResume";
import ElementsPanel from "../components/ElementsPanel";
import LayersPanel from "../components/LayersPanel";
import PreviewPanel from "../components/PreviewPanel";
import RightPanel from "../components/RightPanel";
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
    fontSize: 16,
    primaryColor: "#007BFF",
    secondaryColor: "#F8F9FA",
    spacing: "1rem",
    textColor: "#000000",
    backgroundColor: "#ffffff",
  });
  const [isFinalPreview, setIsFinalPreview] = useState(false);
  const resumeRef = useRef(null);

  // Define section types for the Elements Panel
  const sectionTypes = [
    {
      id: "header",
      label: "Header",
      icon: <FiLayout className="w-5 h-5" />,
      color: "bg-red-100",
      tooltip: "Add a header section to your resume.",
    },
    {
      id: "about",
      label: "About",
      icon: <FiUser className="w-5 h-5" />,
      color: "bg-blue-100",
      tooltip: "Introduce yourself with an about section.",
    },
    {
      id: "experience",
      label: "Experience",
      icon: <FiBriefcase className="w-5 h-5" />,
      color: "bg-green-100",
      tooltip: "Highlight your professional experience.",
    },
    {
      id: "education",
      label: "Education",
      icon: <FiBook className="w-5 h-5" />,
      color: "bg-yellow-100",
      tooltip: "Showcase your educational background.",
    },
    {
      id: "skills",
      label: "Skills",
      icon: <FiCode className="w-5 h-5" />,
      color: "bg-purple-100",
      tooltip: "List your key skills and competencies.",
    },
    {
      id: "projects",
      label: "Projects",
      icon: <FiFileText className="w-5 h-5" />,
      color: "bg-indigo-100",
      tooltip: "Describe your notable projects.",
    },
    {
      id: "certifications",
      label: "Certifications",
      icon: <FiAward className="w-5 h-5" />,
      color: "bg-pink-100",
      tooltip: "Display your certifications and achievements.",
    },
    {
      id: "footer",
      label: "Footer",
      icon: <FiLayout className="w-5 h-5" />,
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

  // Wrap moveSection to prevent moving locked sections
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

  // Handle drop when adding new sections.
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent duplicate drop events
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

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex">
      {/* Left Panel */}
      <div className="w-72 h-screen sticky top-0 overflow-y-auto p-4 bg-white border-r border-gray-200 shadow-md transition-all duration-300">
        {/* Elements Panel */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Elements</h2>
          <ElementsPanel
            sectionTypes={sectionTypes}
            addSection={addSection}
            handleDragStart={(e, id) => e.dataTransfer.setData("sectionId", id)}
          />
        </div>
        {/* Layers Panel */}
        <div className="max-h-[45vh] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Layers</h2>
          <LayersPanel
            sections={sections}
            moveSection={handleMoveSection}
            removeSection={removeSection}
          />
        </div>
      </div>

      {/* Middle Panel: Resume Preview */}
      <div className="flex-1 h-screen overflow-y-auto p-6 relative">
        {/* Toggle button for switching preview mode */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setIsFinalPreview((prev) => !prev)}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white shadow-sm text-gray-800 hover:bg-gray-100 transition-colors"
            aria-label="Toggle Final Preview Mode"
          >
            {isFinalPreview ? "Edit Mode" : "Final Preview"}
          </button>
        </div>

        <div
          className={`bg-white p-8 rounded-lg shadow-lg mx-auto transition-shadow duration-300 ${
            isFinalPreview ? "shadow-2xl" : "shadow-lg"
          }`}
          style={{ maxWidth: "800px" }}
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.classList.add(
              "border-dashed",
              "border-2",
              "border-gray-400"
            );
          }}
          onDragLeave={(e) => {
            e.currentTarget.classList.remove(
              "border-dashed",
              "border-2",
              "border-gray-400"
            );
          }}
          onDrop={(e) => {
            e.currentTarget.classList.remove(
              "border-dashed",
              "border-2",
              "border-gray-400"
            );
            handleDrop(e);
          }}
        >
          <PreviewPanel
            resumeRef={resumeRef}
            sections={sections}
            moveSection={handleMoveSection}
            removeSection={removeSection}
            contextMenu={contextMenu}
            setContextMenu={setContextMenu}
            handleRightClick={(e, id) => {
              e.preventDefault();
              if (!isFinalPreview) {
                setContextMenu({ x: e.pageX, y: e.pageY, sectionId: id });
              }
            }}
            handleDrop={handleDrop}
            currentTemplate={currentTemplate}
            customizations={customizations}
            finalMode={isFinalPreview}
          />
        </div>
      </div>

      {/* Right Panel */}
      <RightPanel
        applyTemplate={applyTemplate}
        customizations={{ ...customizations, template: currentTemplate }}
        updateCustomizations={updateCustomizations}
      />
    </div>
  );
};

export default ResumeBuilder;
