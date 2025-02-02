import { useContext, useState } from "react";
import PropTypes from "prop-types";
import { FiAward } from "react-icons/fi"; // Import an icon for visual appeal
import { ResumeContext } from "../context/resume-context";

const CertificationsSection = ({ sectionId, finalMode = false }) => {
  const { sectionsData, updateSectionContent } = useContext(ResumeContext);
  // Initialize local state with the certifications data from context
  const initialValue = sectionsData[sectionId]?.content.certifications || "";
  const [certifications, setCertifications] = useState(initialValue);

  // Update local state on each keystroke
  const handleChange = (e) => {
    setCertifications(e.target.value);
  };

  // Update the global context when the user leaves the input field
  const handleBlur = () => {
    updateSectionContent(sectionId, { certifications });
  };

  // If in final mode, render a clean preview without editable inputs
  if (finalMode) {
    return (
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Certifications
        </h3>
        <p className="text-gray-700">{certifications}</p>
      </div>
    );
  }

  // Render the editable version of the Certifications section
  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
      {/* Header with Icon */}
      <div className="flex items-center gap-3 mb-4">
        <FiAward size={24} className="text-pink-500" />
        <h3 className="text-lg font-semibold text-gray-800">Certifications</h3>
      </div>

      {/* Input Field */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Add Your Certifications
        </label>
        <input
          type="text"
          placeholder="Enter certifications (comma-separated)"
          className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          value={certifications}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      {/* Helper Text */}
      <div className="mt-3 text-sm text-gray-500 flex items-center gap-2">
        <span>Example:</span>
        <span className="italic">
          AWS Certified Developer, PMP, Scrum Master
        </span>
      </div>
    </div>
  );
};

CertificationsSection.propTypes = {
  sectionId: PropTypes.number.isRequired,
  finalMode: PropTypes.bool,
};

export default CertificationsSection;
