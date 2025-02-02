// src/components/ExperienceSection.jsx
import { useContext, useState } from "react";
import PropTypes from "prop-types";
import { FiBriefcase } from "react-icons/fi"; // Import an icon for visual appeal
import { ResumeContext } from "../context/resume-context";

const ExperienceSection = ({ sectionId, finalMode = false }) => {
  const { sectionsData, updateSectionContent } = useContext(ResumeContext);

  // Retrieve experience content for this section, or use a default structure.
  const initialExperience = sectionsData[sectionId]?.content.experience || {
    company: "",
    role: "",
    description: "",
  };

  // Local state to store experience data while editing
  const [experience, setExperience] = useState(initialExperience);

  // Update local state on each input change
  const handleChange = (field, value) => {
    setExperience((prev) => ({ ...prev, [field]: value }));
  };

  // Update the global context when the user leaves any input field
  const handleBlur = () => {
    updateSectionContent(sectionId, { experience });
  };

  // Render a clean preview if in final mode
  if (finalMode) {
    return (
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Work Experience
        </h3>
        <p className="text-gray-700">
          <strong>Company:</strong> {experience.company}
        </p>
        <p className="text-gray-700">
          <strong>Role:</strong> {experience.role}
        </p>
        <p className="text-gray-700">
          <strong>Description:</strong> {experience.description}
        </p>
      </div>
    );
  }

  // Render the editable version of the Experience section
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
          onChange={(e) => handleChange("company", e.target.value)}
          onBlur={handleBlur}
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
          onChange={(e) => handleChange("role", e.target.value)}
          onBlur={handleBlur}
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
          onChange={(e) => handleChange("description", e.target.value)}
          onBlur={handleBlur}
        ></textarea>
      </div>
    </div>
  );
};

ExperienceSection.propTypes = {
  sectionId: PropTypes.number.isRequired,
  finalMode: PropTypes.bool,
};

export default ExperienceSection;
