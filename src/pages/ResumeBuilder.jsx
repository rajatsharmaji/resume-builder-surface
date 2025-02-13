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
          className="p-2 bg-white rounded-lg shadow-md focus:outline-none active:scale-95 transition-transform border border-gray-200"
        >
          <FiMenu className="w-5 h-5 text-gray-700" />
        </button>
      </div>
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setShowRightPanel(true)}
          className="p-2 bg-white rounded-lg shadow-md focus:outline-none active:scale-95 transition-transform border border-gray-200"
        >
          <MdSettings className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Desktop Left Panel */}
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

      {/* Mobile Left Panel */}
      {showLeftPanel && (
        <div className="md:hidden fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40">
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                Elements & Layers
              </h3>
              <button
                onClick={() => setShowLeftPanel(false)}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiX className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
              <div className="flex-1 overflow-y-auto">
                <ElementsPanel
                  sectionTypes={sectionTypes}
                  addSection={handleAddSectionUnique}
                  mobile
                />
              </div>
              <div className="border-t pt-4 flex-1 overflow-y-auto">
                <LayersPanel
                  sections={sections}
                  moveSection={moveSection}
                  removeSection={removeSection}
                  mobile
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Preview Area */}
      <div
        className="flex-1 p-4 relative overflow-hidden w-full md:max-w-4xl mx-auto mt-12 md:mt-0"
        ref={resumeRef}
      >
        <div className="flex justify-between items-center mb-4 space-x-4">
          <h2 className="text-xl font-bold text-gray-800">
            {finalMode ? "Preview" : "Builder"}
          </h2>
          <button
            onClick={() => setFinalMode((prev) => !prev)}
            className="relative inline-flex items-center justify-center rounded-lg border border-blue-500 bg-transparent px-4 py-2 text-sm font-medium text-blue-600 shadow-sm transition-all duration-300 hover:bg-blue-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-100"
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
          mobile={!finalMode}
        />
      </div>

      {/* Desktop Right Panel */}
      <div className="hidden md:block w-64 border-l border-gray-200 p-4 overflow-y-auto">
        <RightPanel
          customizations={customizations}
          applyTemplate={(templateId) =>
            setCustomizations((prev) => ({ ...prev, template: templateId }))
          }
        />
      </div>

      {/* Mobile Right Panel - Fixed */}
      {showRightPanel && (
        <div className="md:hidden fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40">
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-white p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                Customization
              </h3>
              <button
                onClick={() => setShowRightPanel(false)}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiX className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <RightPanel
                customizations={customizations}
                applyTemplate={(templateId) => {
                  setCustomizations((prev) => ({
                    ...prev,
                    template: templateId,
                  }));
                  setShowRightPanel(false);
                }}
                mobile
              />
            </div>

            <div className="pt-4 border-t">
              <button
                onClick={() => setShowRightPanel(false)}
                className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                Close Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder;
