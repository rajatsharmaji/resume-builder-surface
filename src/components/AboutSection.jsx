// src/components/AboutSection.jsx
import { useContext } from "react";
import PropTypes from "prop-types";
import { FiUser } from "react-icons/fi"; // Import an icon for visual appeal
import { ResumeContext } from "../context/resume-context";

const AboutSection = ({ sectionId }) => {
  const { sectionsData, updateSectionContent } = useContext(ResumeContext);

  // Retrieve the 'about' content for this section
  const about = sectionsData[sectionId]?.content.about || "";

  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
      {/* Header with Icon */}
      <div className="flex items-center gap-3 mb-4">
        <FiUser size={24} className="text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-800">About Me</h3>
      </div>

      {/* Textarea for User Input */}
      <textarea
        placeholder="Write a brief description about yourself..."
        className="block w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        value={about}
        onChange={(e) =>
          updateSectionContent(sectionId, { about: e.target.value })
        }
      />

      {/* Helper Text */}
      <div className="mt-3 text-sm text-gray-500 flex items-center gap-2">
        <span>
          Highlight your key strengths, goals, or professional background.
        </span>
      </div>
    </div>
  );
};

AboutSection.propTypes = {
  sectionId: PropTypes.number.isRequired,
};

export default AboutSection;
