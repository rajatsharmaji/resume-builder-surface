// src/components/EducationSection.jsx
import { useContext } from "react";
import PropTypes from "prop-types";
import { FiBook } from "react-icons/fi"; // Import an icon for visual appeal
import { ResumeContext } from "../context/resume-context";

const EducationSection = ({ sectionId }) => {
  const { sectionsData, updateSectionContent } = useContext(ResumeContext);

  // Retrieve the education content for this section
  const education = sectionsData[sectionId]?.content.education || {
    school: "",
    degree: "",
    year: "",
  };

  // Update the education content in the global state
  const handleInputChange = (field, value) => {
    updateSectionContent(sectionId, {
      education: { ...education, [field]: value },
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
      {/* Header with Icon */}
      <div className="flex items-center gap-3 mb-4">
        <FiBook size={24} className="text-yellow-500" />
        <h3 className="text-lg font-semibold text-gray-800">Education</h3>
      </div>

      {/* School Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          School
        </label>
        <input
          type="text"
          placeholder="Enter your school name"
          className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          value={education.school}
          onChange={(e) => handleInputChange("school", e.target.value)}
        />
      </div>

      {/* Degree Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Degree
        </label>
        <input
          type="text"
          placeholder="Enter your degree"
          className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          value={education.degree}
          onChange={(e) => handleInputChange("degree", e.target.value)}
        />
      </div>

      {/* Year Input */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Year
        </label>
        <input
          type="text"
          placeholder="Enter graduation year"
          className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          value={education.year}
          onChange={(e) => handleInputChange("year", e.target.value)}
        />
      </div>
    </div>
  );
};

EducationSection.propTypes = {
  sectionId: PropTypes.number.isRequired,
};

export default EducationSection;
