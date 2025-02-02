/* eslint-disable react/prop-types */
import { FaTrashAlt, FaGripVertical } from "react-icons/fa";
import HeaderSection from "../sections/HeaderSection";
import FooterSection from "../sections/FooterSection";
import EducationSection from "../sections/EducationSection";
import ExperienceSection from "../sections/ExperienceSection";
import SkillsSection from "../sections/SkillsSection";
import AboutSection from "../sections/AboutSection";
import ProjectsSection from "../sections/ProjectsSection";
import CertificationsSection from "../sections/CertificationsSection";

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
  const isLocked = section.type === "header" || section.type === "footer";

  // Drag & drop is allowed only if the section is not locked.
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
    e.dataTransfer.setData("text/plain", section.id);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (isLocked) {
      alert(
        `${
          section.type.charAt(0).toUpperCase() + section.type.slice(1)
        } section is locked and cannot be repositioned.`
      );
      return;
    }
    const draggedId = e.dataTransfer.getData("text/plain");
    moveSection(draggedId, index);
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
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="mb-4 border border-gray-200 rounded-lg p-4 bg-white shadow-sm 
                 relative transition-transform hover:shadow-md hover:-translate-y-1"
    >
      {!isLocked && (
        <>
          <div
            className="absolute top-1/2 left-2 -translate-y-1/2 cursor-grab text-gray-500 hover:text-gray-700"
            title="Drag to reorder"
          >
            <FaGripVertical size={20} />
          </div>
          <button
            onClick={() => removeSection(section.id)}
            className="absolute top-2 right-2 text-red-500 hover:text-red-600 transition-colors duration-200"
            title="Delete section"
          >
            <FaTrashAlt size={18} />
          </button>
        </>
      )}
      <div className={isLocked ? "" : "pl-8"}>
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
