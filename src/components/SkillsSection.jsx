// src/components/SkillsSection.jsx
import { useContext } from "react";
import PropTypes from "prop-types";
import { FiCode } from "react-icons/fi"; // Import an icon for visual appeal
import { ResumeContext } from "../context/resume-context";

const SkillsSection = ({ sectionId }) => {
  const { sectionsData, updateSectionContent } = useContext(ResumeContext);

  // Retrieve skills content for this section
  const skills = sectionsData[sectionId]?.content?.skills || "";

  // Update the skills content in the global state
  const handleInputChange = (value) => {
    updateSectionContent(sectionId, { skills: value });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
      {/* Header with Icon */}
      <div className="flex items-center gap-3 mb-4">
        <FiCode size={24} className="text-purple-500" />
        <h3 className="text-lg font-semibold text-gray-800">Skills</h3>
      </div>

      {/* Input Field */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Add Your Skills
        </label>
        <input
          type="text"
          placeholder="Enter skills (comma-separated)"
          className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          value={skills}
          onChange={(e) => handleInputChange(e.target.value)}
        />
      </div>

      {/* Helper Text */}
      <div className="mt-3 text-sm text-gray-500 flex items-center gap-2">
        <span>Example:</span>
        <span className="italic">React, JavaScript, Node.js, CSS</span>
      </div>
    </div>
  );
};

SkillsSection.propTypes = {
  sectionId: PropTypes.number.isRequired,
};

export default SkillsSection;
