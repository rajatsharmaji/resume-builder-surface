// src/components/ProjectsSection.jsx
import { useContext, useState } from "react";
import PropTypes from "prop-types";
import { FiCode, FiLink } from "react-icons/fi"; // Import icons for visual appeal
import { ResumeContext } from "../context/resume-context";

const ProjectsSection = ({ sectionId, finalMode = false }) => {
  const { sectionsData, updateSectionContent } = useContext(ResumeContext);

  // Initialize project content from context or use default values.
  const initialProject = sectionsData[sectionId]?.content?.project || {
    title: "",
    description: "",
    link: "",
  };

  // Local state to store project data during editing.
  const [project, setProject] = useState(initialProject);

  // Update local state on each input change.
  const handleChange = (field, value) => {
    setProject((prev) => ({ ...prev, [field]: value }));
  };

  // Update the global context when an input loses focus.
  const handleBlur = () => {
    updateSectionContent(sectionId, { project });
  };

  // Render a clean preview if in final mode.
  if (finalMode) {
    return (
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Projects</h3>
        <p className="text-gray-700">
          <strong>Title:</strong> {project.title}
        </p>
        <p className="text-gray-700">
          <strong>Description:</strong> {project.description}
        </p>
        {project.link && (
          <p className="text-gray-700">
            <strong>Link:</strong>{" "}
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-500"
            >
              {project.link}
            </a>
          </p>
        )}
      </div>
    );
  }

  // Render the editable version.
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
          onChange={(e) => handleChange("title", e.target.value)}
          onBlur={handleBlur}
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
          onChange={(e) => handleChange("description", e.target.value)}
          onBlur={handleBlur}
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
          onChange={(e) => handleChange("link", e.target.value)}
          onBlur={handleBlur}
        />
      </div>
    </div>
  );
};

ProjectsSection.propTypes = {
  sectionId: PropTypes.number.isRequired,
  finalMode: PropTypes.bool,
};

export default ProjectsSection;
