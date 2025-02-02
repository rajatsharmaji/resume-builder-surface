/* eslint-disable react/prop-types */
// src/components/DraggableSection.jsx
import { FaTrashAlt, FaGripVertical } from "react-icons/fa";
import HeaderSection from "./HeaderSection";
import FooterSection from "./FooterSection";
import EducationSection from "./EducationSection";
import ExperienceSection from "./ExperienceSection";
import SkillsSection from "./SkillsSection";
import AboutSection from "./AboutSection";
import ProjectsSection from "./ProjectsSection";
import CertificationsSection from "./CertificationsSection";

// Map section "type" to the actual component
const sectionComponents = {
  header: HeaderSection,
  footer: FooterSection,
  education: EducationSection,
  experience: ExperienceSection,
  skills: SkillsSection,
  about: AboutSection,
  projects: ProjectsSection,
  certifications: CertificationsSection,
};

const DraggableSection = ({
  section,
  index,
  moveSection,
  removeSection,
  finalMode = false, // default false
}) => {
  const Component = sectionComponents[section.type];

  // Drag & drop only needed in edit mode
  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", section.id);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    moveSection(draggedId, index);
  };

  // If finalMode, skip drag handle, delete icon, and fancy card styling
  if (finalMode) {
    return (
      <div className="mb-4">
        {Component ? (
          <Component sectionId={section.id} finalMode />
        ) : (
          <p className="text-gray-500">Unknown Section Type</p>
        )}
      </div>
    );
  }

  // Edit mode: show borders, drag handle, and trash icon
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="mb-4 border border-gray-200 rounded-lg p-4 bg-white shadow-sm 
                 relative transition-transform hover:shadow-md hover:-translate-y-1"
    >
      {/* Drag handle */}
      <div
        className="absolute top-1/2 left-2 -translate-y-1/2 cursor-grab text-gray-500 hover:text-gray-700"
        title="Drag to reorder"
      >
        <FaGripVertical size={20} />
      </div>

      {/* Delete icon */}
      <button
        onClick={() => removeSection(section.id)}
        className="absolute top-2 right-2 text-red-500 hover:text-red-600 transition-colors duration-200"
        title="Delete section"
      >
        <FaTrashAlt size={18} />
      </button>

      {/* Actual content */}
      <div className="pl-8">
        {Component ? (
          <Component sectionId={section.id} finalMode={false} />
        ) : (
          <p className="text-gray-500">Unknown Section Type</p>
        )}
      </div>
    </div>
  );
};

export default DraggableSection;
