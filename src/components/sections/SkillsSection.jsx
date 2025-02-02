// src/components/SkillsSection.jsx
import { useContext, useState } from "react";
import PropTypes from "prop-types";
import { FiCode } from "react-icons/fi"; // Import an icon for visual appeal
import { ResumeContext } from "../../context/resume-context";

const SkillsSection = ({ sectionId, finalMode = false }) => {
  const { sectionsData, updateSectionContent } = useContext(ResumeContext);

  // Initialize local state with the skills data from context
  const initialSkills = sectionsData[sectionId]?.content?.skills || "";
  const [skills, setSkills] = useState(initialSkills);

  // Update local state on each keystroke
  const handleChange = (e) => {
    setSkills(e.target.value);
  };

  // When the user leaves the input field, update the global context
  const handleBlur = () => {
    updateSectionContent(sectionId, { skills });
  };

  // Render a clean preview if in final mode
  if (finalMode) {
    return (
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Skills</h3>
        <p className="text-gray-700">{skills}</p>
      </div>
    );
  }

  // Render the editable version of the Skills section
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
          onChange={handleChange}
          onBlur={handleBlur}
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
  finalMode: PropTypes.bool,
};

export default SkillsSection;
