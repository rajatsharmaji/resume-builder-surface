// src/components/HeaderSection.jsx
import { useContext } from "react";
import PropTypes from "prop-types";
import { ResumeContext } from "../context/resume-context";

const HeaderSection = ({ sectionId }) => {
  const { sectionsData, updateSectionContent } = useContext(ResumeContext);

  // Retrieve header content from sectionsData
  const header = sectionsData[sectionId]?.content || {
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
  };

  return (
    <div className="border-b border-gray-300 py-4 mb-6">
      <div className="flex flex-col space-y-2">
        {/* Name */}
        <input
          type="text"
          placeholder="Your Full Name"
          value={header.name}
          onChange={(e) =>
            updateSectionContent(sectionId, { name: e.target.value })
          }
          className="text-3xl font-bold text-center w-full focus:outline-none"
        />

        {/* Contact Information */}
        <div className="flex justify-center space-x-4 text-sm text-gray-600">
          <input
            type="email"
            placeholder="Email"
            value={header.email}
            onChange={(e) =>
              updateSectionContent(sectionId, { email: e.target.value })
            }
            className="border-none focus:outline-none"
          />
          <span>•</span>
          <input
            type="tel"
            placeholder="Phone"
            value={header.phone}
            onChange={(e) =>
              updateSectionContent(sectionId, { phone: e.target.value })
            }
            className="border-none focus:outline-none"
          />
          <span>•</span>
          <input
            type="url"
            placeholder="LinkedIn"
            value={header.linkedin}
            onChange={(e) =>
              updateSectionContent(sectionId, { linkedin: e.target.value })
            }
            className="border-none focus:outline-none"
          />
          <span>•</span>
          <input
            type="url"
            placeholder="GitHub"
            value={header.github}
            onChange={(e) =>
              updateSectionContent(sectionId, { github: e.target.value })
            }
            className="border-none focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

HeaderSection.propTypes = {
  sectionId: PropTypes.number.isRequired,
};

export default HeaderSection;
