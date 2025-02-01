// src/pages/ResumeBuilder.jsx
import { useState, useRef } from "react";
import {
  FiPlus,
  FiEdit,
  FiLayout,
  FiUser,
  FiBriefcase,
  FiBook,
  FiCode,
  FiAward,
  FiFileText,
  FiDownload,
} from "react-icons/fi";
import ContextMenu from "../components/ContextMenu";
import useResume from "../hooks/useResume";
import SectionList from "../components/SectionList";
import DraggableSection from "../components/DraggableSection";
import DownloadButton from "../components/DownloadButton";

const ResumeBuilder = () => {
  const { sections, addSection, moveSection, removeSection } = useResume();
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const resumeRef = useRef(null);

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

  const handleRightClick = (e, sectionId) => {
    e.preventDefault();
    setSelectedSectionId(sectionId);
    setContextMenu({ x: e.pageX, y: e.pageY });
  };

  const handleRemoveSection = () => {
    if (selectedSectionId) removeSection(selectedSectionId);
    setContextMenu(null);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 flex gap-6 font-sans">
      {/* Left Panel - Controls */}
      <div className="w-72 flex flex-col gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700">
            <FiEdit className="w-5 h-5" /> Resume Builder
          </h2>

          <div className="grid grid-cols-2 gap-2">
            {sectionTypes.map(({ id, label, icon, color }) => (
              <button
                key={id}
                onClick={() => addSection(id)}
                className={`p-3 rounded-lg flex flex-col items-center gap-2 hover:scale-[1.02] transition-transform ${color} hover:${color.replace(
                  "100",
                  "200"
                )} text-gray-600`}
              >
                {icon}
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <SectionList
          sections={sections}
          moveSection={moveSection}
          removeSection={removeSection}
        />
      </div>

      {/* Right Panel - Preview */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
            <FiLayout className="w-5 h-5" /> Resume Preview
          </h2>
          <DownloadButton contentRef={resumeRef} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 relative">
          {contextMenu && (
            <ContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              closeMenu={() => setContextMenu(null)}
              onRemoveSection={handleRemoveSection}
            />
          )}

          <div ref={resumeRef} className="space-y-6">
            {sections.length > 0 ? (
              sections.map((section, index) => (
                <div
                  key={section.id}
                  onContextMenu={(e) => handleRightClick(e, section.id)}
                  className="group relative hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <DraggableSection
                    section={section}
                    index={index}
                    moveSection={moveSection}
                    removeSection={removeSection}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-400">
                <FiPlus className="w-12 h-12 mx-auto mb-4" />
                <p>Click buttons on the left to add sections</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
