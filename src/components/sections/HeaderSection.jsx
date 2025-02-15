import { useContext, useState } from "react";
import PropTypes from "prop-types";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLinkedin,
  FiGithub,
  FiEdit2,
} from "react-icons/fi";
import * as Yup from "yup";
import { ResumeContext } from "../../context/resume-context";
import Loader from "../common/Loader";
import ConfirmationModal from "../common/ConfirmationModal";

const HeaderSection = ({ sectionId, finalMode = false }) => {
  const { sectionsData, updateSectionContent } = useContext(ResumeContext);

  // Updated initial header with separate alias and link fields for LinkedIn and GitHub.
  const initialHeader = sectionsData[sectionId]?.content || {
    name: "",
    email: "",
    phone: "",
    linkedinAlias: "",
    linkedinLink: "",
    githubAlias: "",
    githubLink: "",
  };

  // Local state.
  const [header, setHeader] = useState(initialHeader);
  const [isEditing, setIsEditing] = useState(false);
  const [isFetchingHeader, setIsFetchingHeader] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Yup validation schema.
  const headerSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
    linkedinAlias: Yup.string().nullable(),
    linkedinLink: Yup.string().nullable().url("Invalid LinkedIn URL"),
    githubAlias: Yup.string().nullable(),
    githubLink: Yup.string().nullable().url("Invalid GitHub URL"),
  });

  // Update header state.
  const handleChange = (field, value) => {
    setHeader((prev) => ({ ...prev, [field]: value }));
  };

  // Save header after validating.
  const handleSave = () => {
    headerSchema
      .validate(header, { abortEarly: false })
      .then(() => {
        updateSectionContent(sectionId, header);
        setIsEditing(false);
        setError("");
      })
      .catch((validationError) => {
        if (validationError.inner && validationError.inner.length > 0) {
          setError(validationError.inner[0].message);
        } else {
          setError(validationError.message);
        }
      });
  };

  // Fetch sample header data.
  const fetchHeaderData = async () => {
    try {
      setIsFetchingHeader(true);
      setError("");
      // Simulated API call – replace with your actual endpoint.
      const response = await new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              data: {
                header: {
                  name: "Jane Smith",
                  email: "jane.smith@example.com",
                  phone: "(555) 987-6543",
                  linkedinAlias: "janesmith",
                  linkedinLink: "https://linkedin.com/in/janesmith",
                  githubAlias: "janesmith",
                  githubLink: "https://github.com/janesmith",
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

  // When dragging in non-edit mode, show confirmation.
  const handleDragStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirmation(true);
  };

  // Confirm auto-fill sample data.
  const confirmAutoFill = () => {
    setShowConfirmation(false);
    fetchHeaderData();
  };

  // Cancel auto-fill.
  const cancelAutoFill = () => {
    setShowConfirmation(false);
  };

  // Final (read-only) mode.
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
            {(header.linkedinAlias || header.linkedinLink) && (
              <div className="flex items-center space-x-1">
                <FiLinkedin size={16} className="text-blue-500" />
                {header.linkedinLink ? (
                  <a
                    href={header.linkedinLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {header.linkedinAlias || header.linkedinLink}
                  </a>
                ) : (
                  <span>{header.linkedinAlias}</span>
                )}
              </div>
            )}
            {(header.githubAlias || header.githubLink) && (
              <div className="flex items-center space-x-1">
                <FiGithub size={16} className="text-gray-500" />
                {header.githubLink ? (
                  <a
                    href={header.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {header.githubAlias || header.githubLink}
                  </a>
                ) : (
                  <span>{header.githubAlias}</span>
                )}
              </div>
            )}
          </div>
          <div className="mt-2 text-sm text-gray-400">
            Click to edit – Drag to auto-fill header data available
          </div>
        </div>
      </div>
    );
  }

  // Editable mode.
  return (
    <div
      className="relative group border-l-4 border-blue-500 bg-white rounded-lg p-8 mb-6 shadow-sm transition-all hover:bg-gray-50"
      draggable={!isEditing}
      onDragStart={!isEditing ? handleDragStart : undefined}
    >
      {/* Loader overlay when fetching sample data */}
      {!isEditing && isFetchingHeader && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">
          <Loader size="lg" />
        </div>
      )}
      {/* Header Row */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <FiUser className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-800">Header</h2>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <FiEdit2 className="w-6 h-6" />
        </button>
      </div>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded shadow">
          {error}
        </div>
      )}
      {/* Read-only view */}
      {!isEditing ? (
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
            {(header.linkedinAlias || header.linkedinLink) && (
              <div className="flex items-center space-x-1">
                <FiLinkedin size={16} className="text-blue-500" />
                {header.linkedinLink ? (
                  <a
                    href={header.linkedinLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {header.linkedinAlias || header.linkedinLink}
                  </a>
                ) : (
                  <span>{header.linkedinAlias}</span>
                )}
              </div>
            )}
            {(header.githubAlias || header.githubLink) && (
              <div className="flex items-center space-x-1">
                <FiGithub size={16} className="text-gray-500" />
                {header.githubLink ? (
                  <a
                    href={header.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {header.githubAlias || header.githubLink}
                  </a>
                ) : (
                  <span>{header.githubAlias}</span>
                )}
              </div>
            )}
          </div>
          <div className="mt-2 text-sm text-gray-400">
            Click to edit – Drag to auto-fill header data available
          </div>
        </div>
      ) : (
        // Editable input fields.
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
              LinkedIn Alias
            </label>
            <input
              type="text"
              placeholder="LinkedIn Alias (e.g., johndoe)"
              value={header.linkedinAlias}
              onChange={(e) => handleChange("linkedinAlias", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              LinkedIn Link
            </label>
            <input
              type="url"
              placeholder="LinkedIn URL (e.g., https://linkedin.com/in/johndoe)"
              value={header.linkedinLink}
              onChange={(e) => handleChange("linkedinLink", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              GitHub Alias
            </label>
            <input
              type="text"
              placeholder="GitHub Alias (e.g., johndoe)"
              value={header.githubAlias}
              onChange={(e) => handleChange("githubAlias", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              GitHub Link
            </label>
            <input
              type="url"
              placeholder="GitHub URL (e.g., https://github.com/johndoe)"
              value={header.githubLink}
              onChange={(e) => handleChange("githubLink", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleSave}
            className="mt-3 px-6 py-3 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      )}
      {/* Global confirmation modal (rendered via portal) */}
      <ConfirmationModal
        isOpen={showConfirmation}
        message="This will replace all previous data with sample data. Do you want to proceed?"
        onConfirm={confirmAutoFill}
        onCancel={cancelAutoFill}
      />
    </div>
  );
};

HeaderSection.propTypes = {
  sectionId: PropTypes.number.isRequired,
  finalMode: PropTypes.bool,
};

export default HeaderSection;
