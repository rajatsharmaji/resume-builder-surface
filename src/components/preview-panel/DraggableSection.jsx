/* eslint-disable react/prop-types */
import { FaTrashAlt } from "react-icons/fa";
import HeaderSection from "../sections/HeaderSection";
import FooterSection from "../sections/FooterSection";
import EducationSection from "../sections/EducationSection";
import ExperienceSection from "../sections/ExperienceSection";
import SkillsSection from "../sections/SkillsSection";
import AboutSection from "../sections/AboutSection";
import ProjectsSection from "../sections/ProjectsSection";
import CertificationsSection from "../sections/CertificationsSection";

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

const DraggableSection = ({ section, removeSection, finalMode = false }) => {
  const Component = sectionComponents[section.type];
  const isLocked = section.type === "header";

  const handleDragStart = (e) => {
    if (isLocked) {
      e.preventDefault();
      alert(
        `${
          section.type.charAt(0).toUpperCase() + section.type.slice(1)
        } section is locked and cannot be moved.`
      );
      return;
    }
    e.dataTransfer.setData("application/existing-section", section.id);
  };

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

  return (
    <div
      draggable={!isLocked}
      onDragStart={handleDragStart}
      className="mb-4 border border-gray-200 rounded-lg p-4 bg-white shadow-sm 
                 relative transition-transform hover:shadow-md hover:-translate-y-1"
    >
      {!isLocked && (
        <button
          onClick={() => removeSection(section.id)}
          className="absolute top-2 right-4 z-10 text-red-500 hover:text-red-600 transition-colors duration-200"
          title="Delete section"
        >
          <FaTrashAlt size={18} />
        </button>
      )}
      <div>
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
