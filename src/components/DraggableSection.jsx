/* eslint-disable react/prop-types */
// src/components/DraggableSection.jsx

import { FaTrash } from "react-icons/fa"; // Import trash icon from react-icons
import HeaderSection from "./HeaderSection";
import FooterSection from "./FooterSection";
import EducationSection from "./EducationSection";
import ExperienceSection from "./ExperienceSection";
import SkillsSection from "./SkillsSection";
import AboutSection from "./AboutSection";
import ProjectsSection from "./ProjectsSection";
import CertificationsSection from "./CertificationsSection";

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

const DraggableSection = ({ section, index, moveSection, removeSection }) => {
  const Component = sectionComponents[section.type];

  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", section.id);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    moveSection(draggedId, index);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="mb-4 border border-gray-300 rounded p-4 cursor-move bg-gray-50 relative"
    >
      {/* Delete Icon */}
      <button
        onClick={() => removeSection(section.id)}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
      >
        <FaTrash size={16} />
      </button>

      {/* Render the section component */}
      {Component ? (
        <Component key={section.id} sectionId={section.id} />
      ) : (
        <p>Unknown Section Type</p>
      )}
    </div>
  );
};

export default DraggableSection;
