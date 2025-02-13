import { useState } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { FaTrashAlt } from "react-icons/fa";

import HeaderSection from "../sections/HeaderSection";
import FooterSection from "../sections/FooterSection";
import EducationSection from "../sections/EducationSection";
import ExperienceSection from "../sections/ExperienceSection";
import SkillsSection from "../sections/SkillsSection";
import AboutSection from "../sections/AboutSection";
import ProjectsSection from "../sections/ProjectsSection";
import CertificationsSection from "../sections/CertificationsSection";

// Map section types to their respective components.
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

// A reusable confirmation dialog rendered via a portal.
const ConfirmDialog = ({ title, message, onConfirm, onCancel }) => {
  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50" />
      {/* Modal */}
      <div className="bg-white rounded-lg p-6 z-50 max-w-sm mx-auto shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

ConfirmDialog.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

// The DraggableSection component displays a section and handles deletion.
const DraggableSection = ({ section, removeSection, finalMode = false }) => {
  const Component = sectionComponents[section.type];
  const [showConfirm, setShowConfirm] = useState(false);

  // If you intend for the section to be draggable, set draggable to true.
  // (If not, you can set draggable={false} and remove the onDragStart handler.)
  const handleDragStart = (e) => {
    // Allow drag events (remove preventDefault if you want actual dragging)
    e.preventDefault();
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    removeSection(section.id);
    setShowConfirm(false);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  // When in final mode, simply render the component without the deletion UI.
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
      draggable={true}
      onDragStart={handleDragStart}
      className="mb-4 border border-gray-200 rounded-lg p-4 bg-white shadow-sm relative transition-transform hover:shadow-md hover:-translate-y-1"
    >
      {/* Show delete icon for non-header sections */}
      {section.type !== "header" && (
        <button
          onClick={handleDelete}
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
      {showConfirm && (
        <ConfirmDialog
          title="Confirm Removal"
          message="Are you sure you want to delete this section? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

DraggableSection.propTypes = {
  section: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  removeSection: PropTypes.func.isRequired,
  finalMode: PropTypes.bool,
};

export default DraggableSection;
