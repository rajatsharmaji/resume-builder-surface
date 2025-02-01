import { useContext } from "react";
import PropTypes from "prop-types";
import { ResumeContext } from "../context/resume-context";

const AboutSection = ({ sectionId }) => {
  const { sectionsData, updateSectionContent } = useContext(ResumeContext);
  const about = sectionsData[sectionId]?.content.about || "";

  return (
    <div className="border p-4 my-2">
      <label className="block font-medium mb-2">About Me</label>
      <textarea
        placeholder="Write a brief description about yourself..."
        className="block w-full h-24 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
        value={about}
        onChange={(e) =>
          updateSectionContent(sectionId, { about: e.target.value })
        }
      />
      <div className="mt-2 text-sm text-gray-600">
        Highlight your key strengths, goals, or professional background.
      </div>
    </div>
  );
};

AboutSection.propTypes = {
  sectionId: PropTypes.number.isRequired,
};

export default AboutSection;
