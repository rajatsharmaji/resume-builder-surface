import { useContext, useState } from "react";
import PropTypes from "prop-types";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLinkedin,
  FiGithub,
  FiEdit2,
  FiZap,
} from "react-icons/fi";
import { ResumeContext } from "../../context/resume-context";
import Loader from "../common/Loader";

const HeaderSection = ({ sectionId, finalMode = false }) => {
  const { sectionsData, updateSectionContent } = useContext(ResumeContext);

  // Initialize header content with defaults if not already set in context.
  const initialHeader = sectionsData[sectionId]?.content || {
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
  };

  // Local state for header data and UI states.
  const [header, setHeader] = useState(initialHeader);
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFetchingHeader, setIsFetchingHeader] = useState(false);
  const [error, setError] = useState("");

  // Update local header state on input change.
  const handleChange = (field, value) => {
    setHeader((prev) => ({ ...prev, [field]: value }));
  };

  // Save updates to the global context and exit edit mode.
  const handleSave = () => {
    updateSectionContent(sectionId, header);
    setIsEditing(false);
  };

  // Simulated API call to generate AI-enhanced header data.
  const generateAIContent = async () => {
    try {
      setIsGenerating(true);
      setError("");
      // Simulated API call – replace with your actual API endpoint.
      const response = await new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              data: {
                header: {
                  name: "John Doe",
                  email: "john.doe@example.com",
                  phone: "(555) 123-4567",
                  linkedin: "linkedin.com/in/johndoe",
                  github: "github.com/johndoe",
                },
              },
            }),
          1500
        )
      );
      setHeader(response.data.header);
      updateSectionContent(sectionId, response.data.header);
    } catch (err) {
      console.error(err);
      setError("Failed to generate AI header data. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Simulated API call to fetch header data when dragging the component.
  const fetchHeaderData = async () => {
    try {
      setIsFetchingHeader(true);
      setError("");
      // Simulated API call – replace with your actual API endpoint.
      const response = await new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              data: {
                header: {
                  name: "Jane Smith",
                  email: "jane.smith@example.com",
                  phone: "(555) 987-6543",
                  linkedin: "linkedin.com/in/janesmith",
                  github: "github.com/janesmith",
                },
              },
            }),
          1500
        )
      );
      setHeader(response.data.header);
      updateSectionContent(sectionId, response.data.header);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch header data. Please try again.");
    } finally {
      setIsFetchingHeader(false);
    }
  };

  // Final (preview) mode: display header details in a read-only, professional layout.
  if (finalMode) {
    return (
      <div className="relative group border-l-4 border-blue-500 bg-white rounded-lg p-6 mb-6 shadow-sm">
        {/* Header Row */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <FiUser className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-800">Header</h2>
          </div>
        </div>
        {/* Header Content */}
        <div className="flex flex-col items-center mb-4">
          <h1 className="text-4xl font-bold text-gray-800">
            {header.name || "Your Name"}
          </h1>
          <div className="flex justify-center space-x-6 mt-2 text-sm text-gray-600">
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
      </div>
    );
  }

  // Editable mode: display the header with action buttons and editable inputs.
  return (
    <div
      className="relative group border-l-4 border-blue-500 bg-white rounded-lg p-6 mb-6 shadow-sm transition-all hover:bg-gray-50"
      draggable
      onDragStart={fetchHeaderData} // Dragging auto-fills header data.
    >
      {/* Header Row with Icon, "Header" Heading, and Action Buttons */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <FiUser className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-bold text-gray-800">Header</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={generateAIContent}
            disabled={isGenerating || isFetchingHeader}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
          >
            {isGenerating ? (
              <Loader size="sm" />
            ) : (
              <>
                <FiZap className="w-4 h-4" />
                <span>AI Enhance</span>
              </>
            )}
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiEdit2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

      {/* Read-only Display of Header Details (clicking toggles editing) */}
      {!isEditing && (
        <div
          className="flex flex-col items-center mb-4 cursor-text"
          onClick={() => setIsEditing(true)}
        >
          <h1 className="text-4xl font-bold text-gray-800">
            {header.name || "Your Name"}
          </h1>
          <div className="flex justify-center space-x-6 mt-2 text-sm text-gray-600">
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
      )}

      {/* Editable Input Fields */}
      {isEditing && (
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Your Full Name"
              value={header.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              value={header.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Phone
            </label>
            <input
              type="tel"
              placeholder="Phone"
              value={header.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              LinkedIn
            </label>
            <input
              type="url"
              placeholder="LinkedIn"
              value={header.linkedin}
              onChange={(e) => handleChange("linkedin", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              GitHub
            </label>
            <input
              type="url"
              placeholder="GitHub"
              value={header.github}
              onChange={(e) => handleChange("github", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleSave}
            className="mt-3 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

HeaderSection.propTypes = {
  sectionId: PropTypes.number.isRequired,
  finalMode: PropTypes.bool,
};

export default HeaderSection;
