// src/components/FooterSection.jsx
import { useContext } from "react";
import PropTypes from "prop-types";
import { FiFileText } from "react-icons/fi"; // Import an icon for visual appeal
import { ResumeContext } from "../context/resume-context";

const FooterSection = ({ sectionId }) => {
  const { sectionsData, updateSectionContent } = useContext(ResumeContext);

  // Retrieve footer content from sectionsData
  const footer = sectionsData[sectionId]?.content?.note || "";

  // Update the footer content in the global state
  const handleInputChange = (value) => {
    updateSectionContent(sectionId, { note: value });
  };

  return (
    <div className="border-t border-gray-200 py-6 mt-8 bg-white rounded-lg shadow-sm">
      {/* Header with Icon */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <FiFileText size={24} className="text-indigo-500" />
        <h3 className="text-lg font-semibold text-gray-800">Footer</h3>
      </div>

      {/* Textarea for User Input */}
      <div className="px-6">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Add a Note, Disclaimer, or Links
        </label>
        <textarea
          placeholder="Add a note, disclaimer, or links here..."
          value={footer}
          onChange={(e) => handleInputChange(e.target.value)}
          className="block w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
        ></textarea>
      </div>

      {/* Helper Text */}
      <div className="mt-3 text-center text-sm text-gray-500">
        Use this space for additional notes, disclaimers, or links to your
        portfolio, LinkedIn, etc.
      </div>
    </div>
  );
};

FooterSection.propTypes = {
  sectionId: PropTypes.number.isRequired,
};

export default FooterSection;
