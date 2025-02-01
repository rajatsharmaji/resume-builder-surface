// src/components/ProjectsSection.jsx
import { useContext } from "react";
import PropTypes from "prop-types";
import { FiCode, FiLink } from "react-icons/fi"; // Import icons for visual appeal
import { ResumeContext } from "../context/resume-context";

const ProjectsSection = ({ sectionId }) => {
  const { sectionsData, updateSectionContent } = useContext(ResumeContext);

  // Retrieve project content for this section
  const project = sectionsData[sectionId]?.content?.project || {
    title: "",
    description: "",
    link: "",
  };

  // Update the project content in the global state
  const handleInputChange = (field, value) => {
    updateSectionContent(sectionId, {
      project: { ...project, [field]: value },
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
      {/* Header with Icon */}
      <div className="flex items-center gap-3 mb-4">
        <FiCode size={24} className="text-indigo-500" />
        <h3 className="text-lg font-semibold text-gray-800">Projects</h3>
      </div>

      {/* Project Title Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Project Title
        </label>
        <input
          type="text"
          placeholder="Enter your project title"
          className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          value={project.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
        />
      </div>

      {/* Project Description Textarea */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Project Description
        </label>
        <textarea
          placeholder="Describe your project, including tools, technologies, and outcomes..."
          className="block w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          value={project.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
        ></textarea>
      </div>

      {/* Project Link Input */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
          <FiLink size={16} className="text-gray-500" />
          Project Link (optional)
        </label>
        <input
          type="url"
          placeholder="https://example.com"
          className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          value={project.link}
          onChange={(e) => handleInputChange("link", e.target.value)}
        />
      </div>
    </div>
  );
};

ProjectsSection.propTypes = {
  sectionId: PropTypes.number.isRequired,
};

export default ProjectsSection;
