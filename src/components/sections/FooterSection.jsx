// src/components/FooterSection.jsx
import { useContext, useState } from "react";
import PropTypes from "prop-types";
import { FiFileText } from "react-icons/fi"; // Import an icon for visual appeal
import { ResumeContext } from "../../context/resume-context";

const FooterSection = ({ sectionId, finalMode = false }) => {
  const { sectionsData, updateSectionContent } = useContext(ResumeContext);

  // Retrieve the initial footer note from the context
  const initialValue = sectionsData[sectionId]?.content.note || "";
  const [note, setNote] = useState(initialValue);

  // Update local state on each keystroke
  const handleChange = (e) => {
    setNote(e.target.value);
  };

  // Update the global context when the user leaves the textarea
  const handleBlur = () => {
    updateSectionContent(sectionId, { note });
  };

  // Render a clean preview if in final mode
  if (finalMode) {
    return (
      <div className="mt-8 py-6 bg-white rounded-lg shadow-sm border-t border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">
          Footer
        </h3>
        <p className="text-gray-700 text-center whitespace-pre-wrap">{note}</p>
      </div>
    );
  }

  // Render the editable version of the Footer section
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
          value={note}
          onChange={handleChange}
          onBlur={handleBlur}
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
  finalMode: PropTypes.bool,
};

export default FooterSection;
