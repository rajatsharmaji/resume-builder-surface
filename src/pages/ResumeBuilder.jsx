// src/pages/ResumeBuilder.jsx
import { useState, useRef } from "react";
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

  const handleRightClick = (e, sectionId) => {
    e.preventDefault();
    setSelectedSectionId(sectionId); // Store the ID of the clicked section
    setContextMenu({ x: e.pageX, y: e.pageY });
  };

  const handleAddSection = () => {
    // Open a modal or dropdown to select the type of section to add
    console.log("Add Section Logic Here");
  };

  const handleRemoveSection = () => {
    if (selectedSectionId) {
      removeSection(selectedSectionId); // Remove the selected section
    }
    setContextMenu(null); // Close the context menu
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100 flex">
      {/* Left Section: Builder Controls */}
      <div className="w-1/4 pr-4">
        <h2 className="text-xl font-bold mb-4">Resume Builder</h2>
        <div className="bg-white shadow-md p-4 rounded">
          {/* Add Section Buttons */}
          <button
            onClick={() => addSection("header")}
            className="block w-full text-left py-2 px-4 mb-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Add Header Section
          </button>
          <button
            onClick={() => addSection("about")}
            className="block w-full text-left py-2 px-4 mb-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add About Section
          </button>
          <button
            onClick={() => addSection("experience")}
            className="block w-full text-left py-2 px-4 mb-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add Experience Section
          </button>
          <button
            onClick={() => addSection("education")}
            className="block w-full text-left py-2 px-4 mb-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Add Education Section
          </button>
          <button
            onClick={() => addSection("skills")}
            className="block w-full text-left py-2 px-4 mb-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Add Skills Section
          </button>
          <button
            onClick={() => addSection("projects")}
            className="block w-full text-left py-2 px-4 mb-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            Add Projects Section
          </button>
          <button
            onClick={() => addSection("certifications")}
            className="block w-full text-left py-2 px-4 bg-pink-500 text-white rounded hover:bg-pink-600"
          >
            Add Certifications Section
          </button>
          <button
            onClick={() => addSection("footer")}
            className="block w-full text-left py-2 px-4 mt-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Add Footer Section
          </button>
        </div>
        {/* Layer Section */}
        <SectionList
          sections={sections}
          moveSection={moveSection}
          removeSection={removeSection}
        />
      </div>

      {/* Right Section: Resume Preview */}
      <div className="w-3/4 pl-4">
        <h2 className="text-xl font-bold mb-4">Resume Preview</h2>
        <div className="bg-white shadow-md p-6 rounded relative">
          {contextMenu && (
            <ContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              closeMenu={() => setContextMenu(null)}
              onAddSection={handleAddSection}
              onRemoveSection={handleRemoveSection}
            />
          )}
          <div ref={resumeRef}>
            {sections.length > 0 ? (
              <div>
                {sections.map((section, index) => (
                  <div
                    key={section.id}
                    onContextMenu={(e) => handleRightClick(e, section.id)}
                  >
                    <DraggableSection
                      section={section}
                      index={index}
                      moveSection={moveSection}
                      removeSection={removeSection}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p>No content to display</p>
            )}
          </div>
        </div>
        <div className="mt-4 text-center">
          <DownloadButton contentRef={resumeRef}>
            Download Resume
          </DownloadButton>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
