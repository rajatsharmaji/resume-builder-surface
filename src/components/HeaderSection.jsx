// src/components/HeaderSection.jsx
import { useContext, useState } from "react";
import PropTypes from "prop-types";
import { FiUser, FiMail, FiPhone, FiLinkedin, FiGithub } from "react-icons/fi"; // Import icons for visual appeal
import { ResumeContext } from "../context/resume-context";

const HeaderSection = ({ sectionId, finalMode = false }) => {
  const { sectionsData, updateSectionContent } = useContext(ResumeContext);

  // Initialize header content with defaults if not already set in context
  const initialHeader = sectionsData[sectionId]?.content || {
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
  };

  // Local state to hold header data while editing
  const [header, setHeader] = useState(initialHeader);

  // Update local state on each input change
  const handleChange = (field, value) => {
    setHeader((prev) => ({ ...prev, [field]: value }));
  };

  // Update the global context when an input loses focus
  const handleBlur = () => {
    updateSectionContent(sectionId, header);
  };

  // Render a clean preview if in final mode
  if (finalMode) {
    return (
      <div className="border-b border-gray-200 py-6 mb-8 bg-white rounded-lg shadow-sm">
        <div className="flex flex-col items-center space-y-2 mb-4">
          <h1 className="text-3xl font-bold text-center">{header.name}</h1>
        </div>
        <div className="flex justify-center space-x-4 text-sm text-gray-600">
          {header.email && (
            <div className="flex items-center space-x-1">
              <FiMail size={16} className="text-gray-500" />
              <span>{header.email}</span>
            </div>
          )}
          {header.phone && (
            <div className="flex items-center space-x-1">
              <FiPhone size={16} className="text-gray-500" />
              <span>{header.phone}</span>
            </div>
          )}
          {header.linkedin && (
            <div className="flex items-center space-x-1">
              <FiLinkedin size={16} className="text-blue-500" />
              <span>{header.linkedin}</span>
            </div>
          )}
          {header.github && (
            <div className="flex items-center space-x-1">
              <FiGithub size={16} className="text-gray-500" />
              <span>{header.github}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render the editable version of the header
  return (
    <div className="border-b border-gray-200 py-6 mb-8 bg-white rounded-lg shadow-sm">
      {/* Name Input */}
      <div className="flex flex-col items-center space-y-2 mb-4">
        <FiUser size={32} className="text-blue-500" />
        <input
          type="text"
          placeholder="Your Full Name"
          value={header.name}
          onChange={(e) => handleChange("name", e.target.value)}
          onBlur={handleBlur}
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
            value={header.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={handleBlur}
            className="border-none focus:outline-none focus:text-blue-500"
          />
        </div>

        {/* Phone */}
        <div className="flex items-center space-x-1">
          <FiPhone size={16} className="text-gray-500" />
          <input
            type="tel"
            placeholder="Phone"
            value={header.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            onBlur={handleBlur}
            className="border-none focus:outline-none focus:text-blue-500"
          />
        </div>

        {/* LinkedIn */}
        <div className="flex items-center space-x-1">
          <FiLinkedin size={16} className="text-blue-500" />
          <input
            type="url"
            placeholder="LinkedIn"
            value={header.linkedin}
            onChange={(e) => handleChange("linkedin", e.target.value)}
            onBlur={handleBlur}
            className="border-none focus:outline-none focus:text-blue-500"
          />
        </div>

        {/* GitHub */}
        <div className="flex items-center space-x-1">
          <FiGithub size={16} className="text-gray-500" />
          <input
            type="url"
            placeholder="GitHub"
            value={header.github}
            onChange={(e) => handleChange("github", e.target.value)}
            onBlur={handleBlur}
            className="border-none focus:outline-none focus:text-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

HeaderSection.propTypes = {
  sectionId: PropTypes.number.isRequired,
  finalMode: PropTypes.bool,
};

export default HeaderSection;
