// src/components/ExperienceSection.jsx
import { useContext } from "react";
import PropTypes from "prop-types";
import { FiBriefcase } from "react-icons/fi"; // Import an icon for visual appeal
import { ResumeContext } from "../context/resume-context";

const ExperienceSection = ({ sectionId }) => {
  const { sectionsData, updateSectionContent } = useContext(ResumeContext);

  // Retrieve experience content for this section
  const experience = sectionsData[sectionId]?.content.experience || {
    company: "",
    role: "",
    description: "",
  };

  // Update the experience content in the global state
  const handleInputChange = (field, value) => {
    updateSectionContent(sectionId, {
      experience: { ...experience, [field]: value },
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
      {/* Header with Icon */}
      <div className="flex items-center gap-3 mb-4">
        <FiBriefcase size={24} className="text-green-500" />
        <h3 className="text-lg font-semibold text-gray-800">Work Experience</h3>
      </div>

      {/* Company Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Company Name
        </label>
        <input
          type="text"
          placeholder="Enter your company name"
          className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          value={experience.company}
          onChange={(e) => handleInputChange("company", e.target.value)}
        />
      </div>

      {/* Role Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Role
        </label>
        <input
          type="text"
          placeholder="Enter your role"
          className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          value={experience.role}
          onChange={(e) => handleInputChange("role", e.target.value)}
        />
      </div>

      {/* Description Textarea */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Description
        </label>
        <textarea
          placeholder="Describe your responsibilities and achievements..."
          className="block w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          value={experience.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
        ></textarea>
      </div>
    </div>
  );
};

ExperienceSection.propTypes = {
  sectionId: PropTypes.number.isRequired,
};

export default ExperienceSection;
