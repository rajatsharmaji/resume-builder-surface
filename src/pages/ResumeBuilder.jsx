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
  FiMenu,
  FiX,
} from "react-icons/fi";
import { MdFlashOn, MdSettings } from "react-icons/md";

const ResumeBuilder = () => {
  const { sections, addSection, moveSection, removeSection } = useResume();
  const [contextMenu, setContextMenu] = useState(null);
  const [currentTemplate] = useState("default");
  const [customizations, setCustomizations] = useState({
    font: "Roboto, sans-serif",
    fontSize: 16,
    primaryColor: "#007BFF",
    secondaryColor: "#F8F9FA",
    spacing: "1rem",
    textColor: "#000000",
    backgroundColor: "#ffffff",
    template: "",
  });
  const [finalMode, setFinalMode] = useState(false);
  const resumeRef = useRef(null);

  // State to toggle mobile panels
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);

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

  // Ensure unique sections.
  const handleAddSectionUnique = (sectionType) => {
    if (sections.some((s) => s.type === sectionType)) return;
    addSection(sectionType);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const existingSectionId = e.dataTransfer.getData(
      "application/existing-section"
    );
    const newSectionId = e.dataTransfer.getData("sectionId");

    const previewRect = resumeRef.current.getBoundingClientRect();
    const dropY = e.clientY - previewRect.top;
    // Query only the sections by a dedicated class to avoid picking up extra nodes.
    const sectionNodes = Array.from(
      resumeRef.current.querySelectorAll(".draggable-section")
    );
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

    // Adjust for header/footer positioning.
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
      if (sections.some((s) => s.type === newSectionId)) return;
      addSection(newSectionId, insertIndex);
    }
  };

  const handleRightClick = (e, id) => {
    e.preventDefault();
    if (!finalMode) setContextMenu({ x: e.pageX, y: e.pageY, sectionId: id });
  };

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Mobile Toggle Buttons */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setShowLeftPanel(true)}
          className="p-2 bg-white rounded-full shadow focus:outline-none"
        >
          <FiMenu size={28} className="text-blue-600" />
        </button>
      </div>
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setShowRightPanel(true)}
          className="p-2 bg-white rounded-full shadow focus:outline-none"
        >
          <MdSettings size={28} className="text-blue-600" />
        </button>
      </div>

      {/* Left Panel for medium screens and above */}
      <div className="hidden md:flex flex-col w-64 border-r border-gray-200 p-4">
        <div className="mb-4 flex-1 overflow-y-auto">
          <ElementsPanel
            sectionTypes={sectionTypes}
            addSection={handleAddSectionUnique}
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          <LayersPanel
            sections={sections}
            moveSection={moveSection}
            removeSection={removeSection}
          />
        </div>
      </div>

      {/* Mobile Left Panel Overlay */}
      {showLeftPanel && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40">
          <div className="absolute left-0 top-0 bottom-0 w-3/4 bg-white p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Elements & Layers</h3>
              <button
                onClick={() => setShowLeftPanel(false)}
                className="p-1 rounded-full focus:outline-none"
              >
                <FiX size={24} />
              </button>
            </div>
            {/* Two separate scrollable areas */}
            <div className="mb-4 h-1/2 overflow-y-auto">
              <ElementsPanel
                sectionTypes={sectionTypes}
                addSection={handleAddSectionUnique}
              />
            </div>
            <div className="h-1/2 overflow-y-auto">
              <LayersPanel
                sections={sections}
                moveSection={moveSection}
                removeSection={removeSection}
              />
            </div>
          </div>
        </div>
      )}

      {/* Preview Panel Container with reduced width */}
      <div
        className="flex-1 p-4 relative overflow-hidden max-w-4xl mx-auto"
        ref={resumeRef}
      >
        <div className="flex justify-between items-center mb-4 space-x-4">
          <h2 className="text-xl font-bold text-gray-800">
            {finalMode ? "Preview" : "Builder"}
          </h2>
          <button
            onClick={() => setFinalMode((prev) => !prev)}
            className="relative inline-flex items-center justify-center rounded border border-blue-500 bg-transparent px-5 py-2 text-sm font-medium text-blue-600 shadow-sm transition-all duration-300 hover:bg-blue-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
          >
            <span className="flex items-center gap-2">
              <MdFlashOn className="w-4 h-4 text-blue-600" />
              <span>{finalMode ? "Edit Mode" : "Generate"}</span>
            </span>
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

      {/* Right Panel for medium screens and above */}
      <div className="hidden md:block w-64 border-l border-gray-200 p-4 overflow-y-auto">
        <RightPanel
          customizations={customizations}
          applyTemplate={(templateId) =>
            setCustomizations((prev) => ({ ...prev, template: templateId }))
          }
        />
      </div>

      {/* Mobile Right Panel Overlay */}
      {showRightPanel && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40">
          <div className="absolute right-0 top-0 bottom-0 w-3/4 bg-white p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Customization</h3>
              <button
                onClick={() => setShowRightPanel(false)}
                className="p-1 rounded-full focus:outline-none"
              >
                <FiX size={24} />
              </button>
            </div>
            <RightPanel
              customizations={customizations}
              applyTemplate={(templateId) =>
                setCustomizations((prev) => ({ ...prev, template: templateId }))
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder;
