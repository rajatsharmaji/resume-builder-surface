// src/components/EducationSection.jsx
import { useContext, useState } from "react";
import PropTypes from "prop-types";
import { FiBook } from "react-icons/fi"; // Import an icon for visual appeal
import { ResumeContext } from "../context/resume-context";

const EducationSection = ({ sectionId, finalMode = false }) => {
  const { sectionsData, updateSectionContent } = useContext(ResumeContext);

  // Retrieve the education content from context, or use a default structure.
  const initialEducation = sectionsData[sectionId]?.content.education || {
    school: "",
    degree: "",
    year: "",
  };

  // Local state for handling input changes
  const [education, setEducation] = useState(initialEducation);

  // Update the local state on each input change
  const handleChange = (field, value) => {
    setEducation((prev) => ({ ...prev, [field]: value }));
  };

  // Update the global context when the user leaves an input field
  const handleBlur = () => {
    updateSectionContent(sectionId, { education });
  };

  // Render a clean preview if in final mode
  if (finalMode) {
    return (
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Education</h3>
        <p className="text-gray-700">
          <strong>School:</strong> {education.school}
        </p>
        <p className="text-gray-700">
          <strong>Degree:</strong> {education.degree}
        </p>
        <p className="text-gray-700">
          <strong>Year:</strong> {education.year}
        </p>
      </div>
    );
  }

  // Render the editable version of the Education section
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
          onChange={(e) => handleChange("school", e.target.value)}
          onBlur={handleBlur}
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
          onChange={(e) => handleChange("degree", e.target.value)}
          onBlur={handleBlur}
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
          onChange={(e) => handleChange("year", e.target.value)}
          onBlur={handleBlur}
        />
      </div>
    </div>
  );
};

EducationSection.propTypes = {
  sectionId: PropTypes.number.isRequired,
  finalMode: PropTypes.bool,
};

export default EducationSection;
