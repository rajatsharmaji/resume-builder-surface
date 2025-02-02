import { useContext, useState } from "react";
import PropTypes from "prop-types";
import { FiUser } from "react-icons/fi";
import { ResumeContext } from "../../context/resume-context";

const AboutSection = ({ sectionId, finalMode = false }) => {
  const { sectionsData, updateSectionContent } = useContext(ResumeContext);
  const initialValue = sectionsData[sectionId]?.content.about || "";
  const [about, setAbout] = useState(initialValue);

  // Update local state on each keystroke without updating context immediately.
  const handleChange = (e) => {
    setAbout(e.target.value);
  };

  // When the user leaves the textarea (onBlur), update the global context.
  const handleBlur = () => {
    updateSectionContent(sectionId, { about });
  };

  if (finalMode) {
    // Render a clean, minimal version for the final resume
    return (
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">About Me</h3>
        <p className="text-gray-700 whitespace-pre-wrap">{about}</p>
      </div>
    );
  }

  // Render the editable version with borders, textarea, etc.
  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm mb-4">
      <div className="flex items-center gap-3 mb-4">
        <FiUser size={24} className="text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-800">About Me</h3>
      </div>
      <textarea
        placeholder="Write a brief description about yourself..."
        className="block w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        value={about}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <div className="mt-3 text-sm text-gray-500">
        Highlight your key strengths, goals, or professional background.
      </div>
    </div>
  );
};

AboutSection.propTypes = {
  sectionId: PropTypes.number.isRequired,
  finalMode: PropTypes.bool,
};

export default AboutSection;
