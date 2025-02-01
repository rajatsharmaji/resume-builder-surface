// src/components/HeaderSection.jsx
import { useContext } from "react";
import PropTypes from "prop-types";
import { FiUser, FiMail, FiPhone, FiLinkedin, FiGithub } from "react-icons/fi"; // Import icons for visual appeal
import { ResumeContext } from "../context/resume-context";

const HeaderSection = ({ sectionId }) => {
  const { sectionsData, updateSectionContent } = useContext(ResumeContext);

  // Ensure header content is always initialized with default values
  const header = sectionsData[sectionId]?.content || {
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
  };

  // Update the header content in the global state
  const handleInputChange = (field, value) => {
    updateSectionContent(sectionId, { [field]: value });
  };

  return (
    <div className="border-b border-gray-200 py-6 mb-8 bg-white rounded-lg shadow-sm">
      {/* Name Input */}
      <div className="flex flex-col items-center space-y-2 mb-4">
        <FiUser size={32} className="text-blue-500" />
        <input
          type="text"
          placeholder="Your Full Name"
          value={header.name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className="text-3xl font-bold text-center w-full focus:outline-none focus:text-blue-700"
        />
      </div>

      {/* Contact Information */}
      <div className="flex justify-center space-x-4 text-sm text-gray-600">
        {/* Email */}
        <div className="flex items-center space-x-1">
          <FiMail size={16} className="text-gray-500" />
          <input
            type="email"
            placeholder="Email"
            value={header.email || ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="border-none focus:outline-none focus:text-blue-500"
          />
        </div>

        {/* Phone */}
        <div className="flex items-center space-x-1">
          <FiPhone size={16} className="text-gray-500" />
          <input
            type="tel"
            placeholder="Phone"
            value={header.phone || ""}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="border-none focus:outline-none focus:text-blue-500"
          />
        </div>

        {/* LinkedIn */}
        <div className="flex items-center space-x-1">
          <FiLinkedin size={16} className="text-blue-500" />
          <input
            type="url"
            placeholder="LinkedIn"
            value={header.linkedin || ""}
            onChange={(e) => handleInputChange("linkedin", e.target.value)}
            className="border-none focus:outline-none focus:text-blue-500"
          />
        </div>

        {/* GitHub */}
        <div className="flex items-center space-x-1">
          <FiGithub size={16} className="text-gray-500" />
          <input
            type="url"
            placeholder="GitHub"
            value={header.github || ""}
            onChange={(e) => handleInputChange("github", e.target.value)}
            className="border-none focus:outline-none focus:text-blue-500"
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
