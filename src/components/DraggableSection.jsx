/* eslint-disable react/prop-types */
// src/components/DraggableSection.jsx
import { FaTrashAlt, FaGripVertical } from "react-icons/fa"; // Use FaTrashAlt for a cleaner trash icon
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
      className="mb-4 border border-gray-200 rounded-lg p-4 bg-white shadow-sm relative transition-transform hover:shadow-md hover:-translate-y-1"
    >
      {/* Drag Handle */}
      <div
        className="absolute top-1/2 left-2 transform -translate-y-1/2 cursor-grab text-gray-500 hover:text-gray-700"
        title="Drag to reorder"
      >
        <FaGripVertical size={20} />
      </div>

      {/* Delete Icon */}
      <button
        onClick={() => removeSection(section.id)}
        className="absolute top-2 right-2 text-red-500 hover:text-red-600 transition-colors duration-200 ease-in-out"
        title="Delete section"
      >
        <FaTrashAlt size={18} /> {/* Use FaTrashAlt for a cleaner look */}
      </button>

      {/* Render the section component */}
      <div className="pl-8">
        {Component ? (
          <Component key={section.id} sectionId={section.id} />
        ) : (
          <p className="text-gray-500">Unknown Section Type</p>
        )}
      </div>
    </div>
  );
};

export default DraggableSection;
