// src/components/FooterSection.jsx
import { useContext } from "react";
import PropTypes from "prop-types";
import { ResumeContext } from "../context/resume-context";

const FooterSection = ({ sectionId }) => {
  const { sectionsData, updateSectionContent } = useContext(ResumeContext);

  // Retrieve footer content from sectionsData
  const footer = sectionsData[sectionId]?.content?.note || "";

  return (
    <div className="border-t border-gray-300 py-4 mt-6 text-center text-sm text-gray-600">
      <textarea
        placeholder="Add a note, disclaimer, or links here..."
        value={footer}
        onChange={(e) =>
          updateSectionContent(sectionId, { note: e.target.value })
        }
        className="w-full h-16 border-none focus:outline-none resize-none"
      />
    </div>
  );
};

FooterSection.propTypes = {
  sectionId: PropTypes.number.isRequired,
};

export default FooterSection;
