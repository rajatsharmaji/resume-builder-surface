// src/components/ProjectsSection.jsx
import { useContext, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { FiCode, FiLink, FiEdit2, FiTrash2 } from "react-icons/fi";
import { FaMagic } from "react-icons/fa";
import { AiFillThunderbolt } from "react-icons/ai";
import axios from "axios";
import * as Yup from "yup";
import { ResumeContext } from "../../../../shared/context/resume-context";
import Loader from "../../../../shared/components/Loader";
import ConfirmationModal from "../../../../shared/components/ConfirmationModal";
import AIPreviewModal from "../../../../shared/components/AIPreviewModal";

const ProjectsSection = ({ sectionId, finalMode = false }) => {
  const { sectionsData, updateSectionContent } = useContext(ResumeContext);

  // Compute initial projects data.
  const initialProjects = Array.isArray(
    sectionsData[sectionId]?.content?.projects
  )
    ? sectionsData[sectionId].content.projects
    : sectionsData[sectionId]?.content?.projects
    ? [sectionsData[sectionId].content.projects]
    : [{ title: "", description: "", link: "" }];

  const [projects, setProjects] = useState(initialProjects);
  const [isEditing, setIsEditing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");
  // Track which project description is currently being AI enhanced.
  const [generatingDescIndex, setGeneratingDescIndex] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // New state for AI preview and sample confirmation.
  const [aiResult, setAiResult] = useState("");
  const [aiIndex, setAiIndex] = useState(null);
  const [showAIPreview, setShowAIPreview] = useState(false);
  const [showSampleConfirm, setShowSampleConfirm] = useState(false);
  const [showAICancelConfirm, setShowAICancelConfirm] = useState(false);
  const [sampleIndex, setSampleIndex] = useState(null);

  // Suggested project title keywords.
  const projectTitleSuggestions = [
    "Portfolio Website",
    "E-commerce Platform",
    "Social Media App",
    "Chat Application",
    "Data Visualization Dashboard",
  ];

  // Yup validation schema for each project.
  const projectEntrySchema = Yup.object().shape({
    title: Yup.string().required("Project title is required"),
    description: Yup.string()
      .required("Project description is required")
      .min(10, "Description must be at least 10 characters"),
    link: Yup.string().url("Project link must be a valid URL").nullable(),
  });
  const projectSchema = Yup.array().of(projectEntrySchema);

  // Update a specific project entry.
  const handleProjectChange = useCallback((index, field, value) => {
    setProjects((prev) => {
      const newProjects = [...prev];
      newProjects[index] = { ...newProjects[index], [field]: value };
      return newProjects;
    });
  }, []);

  // Remove a project entry.
  const handleRemoveEntry = useCallback((index, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setProjects((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Save changes after validating with Yup.
  const handleSave = useCallback(() => {
    projectSchema
      .validate(projects, { abortEarly: false })
      .then(() => {
        updateSectionContent(sectionId, { projects });
        setIsEditing(false);
        setError("");
      })
      .catch((validationError) => {
        if (
          validationError.inner &&
          Array.isArray(validationError.inner) &&
          validationError.inner.length > 0
        ) {
          setError(validationError.inner[0].message);
        } else {
          setError(validationError.message);
        }
      });
  }, [projects, projectSchema, updateSectionContent, sectionId]);

  // Add a new project entry.
  const handleAddMore = useCallback(() => {
    setError("");
    setProjects((prev) => [...prev, { title: "", description: "", link: "" }]);
  }, []);

  // Simulated API call to fetch projects data on drag.
  const fetchProjectsData = async () => {
    try {
      setIsFetching(true);
      setError("");
      // Simulated API call – replace with your actual endpoint.
      const response = await new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              data: {
                projects: [
                  {
                    title: "Project Gamma",
                    description:
                      "A project focusing on scalability and performance improvements using cloud-native technologies.",
                    link: "https://gamma.example.com",
                  },
                ],
              },
            }),
          1500
        )
      );
      setProjects(response.data.projects);
      updateSectionContent(sectionId, { projects: response.data.projects });
    } catch (err) {
      console.error(err);
      setError("Failed to fetch projects data. Please try again.");
    } finally {
      setIsFetching(false);
    }
  };

  // Handle drag-to-auto-fill with confirmation modal.
  const handleDragStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirmation(true);
  };

  const confirmAutoFill = () => {
    setShowConfirmation(false);
    fetchProjectsData();
  };

  const cancelAutoFill = () => {
    setShowConfirmation(false);
  };

  // ----- SAMPLE DATA CONFIRMATION -----
  // Instead of immediately setting sample project description, trigger a confirmation modal.
  const confirmSampleData = () => {
    const sampleDesc =
      "Developed innovative solutions that streamline processes and boost performance.";
    if (sampleIndex !== null) {
      setProjects((prev) => {
        const newProjects = [...prev];
        newProjects[sampleIndex] = {
          ...newProjects[sampleIndex],
          description: sampleDesc,
        };
        return newProjects;
      });
    }
    setShowSampleConfirm(false);
    setSampleIndex(null);
  };

  // ----- AI ENHANCEMENT HANDLERS -----
  // Call AI to enhance the project description; show the result in a preview modal for confirmation.
  const handleProjectAIDesc = useCallback(
    async (index, e) => {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      try {
        setGeneratingDescIndex(index);
        setAiIndex(index);
        setError("");
        const response = await axios.post(
          "http://localhost:3008/api/v1/ai/project-description",
          { text: projects[index].description }
        );
        setAiResult(response.data.result);
        setShowAIPreview(true);
      } catch (err) {
        console.error(err);
        setError("Failed to enhance project description. Please try again.");
      } finally {
        setGeneratingDescIndex(null);
      }
    },
    [projects]
  );

  // When the user clicks "Add" in the AI preview modal, update the description.
  const handleAIPreviewAdd = () => {
    if (aiIndex !== null) {
      setProjects((prev) => {
        const newProjects = [...prev];
        newProjects[aiIndex] = {
          ...newProjects[aiIndex],
          description: aiResult,
        };
        return newProjects;
      });
    }
    setShowAIPreview(false);
    setAiIndex(null);
    setAiResult("");
  };

  // For AI Preview modal cancel, hide the modal and then show a cancel confirmation modal.
  const handleAIPreviewCancelClick = () => {
    setShowAIPreview(false);
    setShowAICancelConfirm(true);
  };

  // When the user confirms AI cancel (i.e. discards the generated content).
  const confirmAICancel = () => {
    setShowAICancelConfirm(false);
  };

  // When the user cancels the AI cancel confirmation, re-show the AI Preview Modal.
  const cancelAICancel = () => {
    setShowAICancelConfirm(false);
    setShowAIPreview(true);
  };

  // Final (read-only) mode view.
  if (finalMode) {
    return (
      <div className="mb-6 p-6 bg-white shadow rounded">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Projects</h3>
        {projects.map((proj, index) => (
          <div key={index} className="mb-4">
            <p className="text-gray-700">
              <strong>Title:</strong> {proj.title || "N/A"}
            </p>
            <p className="text-gray-700">
              <strong>Description:</strong> {proj.description || "N/A"}
            </p>
            {proj.link && (
              <p className="text-gray-700">
                <strong>Link:</strong>{" "}
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  {proj.link}
                </a>
              </p>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Editable mode view.
  return (
    <div
      className="relative group border-l-4 border-blue-500 bg-white shadow-lg rounded-lg p-8 mb-6 transition-transform duration-200 hover:scale-105"
      draggable={!isEditing}
      onDragStart={!isEditing ? handleDragStart : undefined}
    >
      {/* Loader overlay when fetching projects data */}
      {isFetching && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">
          <Loader size="lg" />
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <FiCode className="w-7 h-7 text-blue-500" />
          <h3 className="text-2xl font-semibold text-gray-800">Projects</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiEdit2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="relative space-y-8">
          {projects.map((proj, index) => (
            <div key={index} className="mb-8 border-b pb-4 relative">
              {projects.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => handleRemoveEntry(index, e)}
                  className="absolute top-0 right-0 p-2 text-red-500 hover:text-red-700 transition-colors"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              )}
              {/* Project Title with Suggestions */}
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  placeholder="Enter project title"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                  value={proj.title}
                  onChange={(e) =>
                    handleProjectChange(index, "title", e.target.value)
                  }
                  list={`project-title-suggestions-${index}`}
                />
                <datalist id={`project-title-suggestions-${index}`}>
                  {projectTitleSuggestions.map((title, i) => (
                    <option key={i} value={title} />
                  ))}
                </datalist>
              </div>
              {/* Project Description */}
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Project Description
                </label>
                <textarea
                  placeholder="Enter project description"
                  className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition duration-150"
                  value={proj.description}
                  onChange={(e) =>
                    handleProjectChange(index, "description", e.target.value)
                  }
                ></textarea>
              </div>
              {/* Sample and AI Enhance buttons for project description */}
              <div className="flex gap-3 mt-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSampleIndex(index);
                    setShowSampleConfirm(true);
                  }}
                  className="flex items-center gap-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md shadow-sm hover:bg-gray-300 transition-colors text-sm"
                >
                  <FaMagic className="w-4 h-4" />
                  <span>Sample</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleProjectAIDesc(index, e)}
                  disabled={generatingDescIndex === index}
                  className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 transition-colors text-sm disabled:opacity-50"
                >
                  {generatingDescIndex === index ? (
                    <Loader size="sm" />
                  ) : (
                    <>
                      <AiFillThunderbolt className="w-4 h-4" />
                      <span>AI Enhance</span>
                    </>
                  )}
                </button>
              </div>
              {/* Project Link */}
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                  <FiLink size={16} className="text-gray-500" />
                  Project Link (optional)
                </label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                  value={proj.link}
                  onChange={(e) =>
                    handleProjectChange(index, "link", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
          {/* Error Message above the action buttons */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded shadow">
              {error}
            </div>
          )}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="mt-3 px-6 py-3 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={handleAddMore}
              className="mt-3 px-6 py-3 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition-colors"
            >
              Add More
            </button>
          </div>
        </div>
      ) : (
        <div className="cursor-text" onClick={() => setIsEditing(true)}>
          {projects.map((proj, index) => (
            <div key={index} className="mb-4">
              <p className="text-gray-700">
                <strong>Title:</strong> {proj.title || "Click to add title"}
              </p>
              <p className="text-gray-700">
                <strong>Description:</strong>{" "}
                {proj.description || "Click to add description"}
              </p>
              {proj.link && (
                <p className="text-gray-700">
                  <strong>Link:</strong>{" "}
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    {proj.link}
                  </a>
                </p>
              )}
            </div>
          ))}
          <div className="mt-2 text-sm text-gray-400">
            Click to edit – Drag to auto-fill sample data
          </div>
        </div>
      )}

      {/* --- Global Modals Rendered via Portals --- */}
      <ConfirmationModal
        isOpen={showConfirmation}
        message="This will replace all previous data with sample data. Do you want to proceed?"
        onConfirm={confirmAutoFill}
        onCancel={cancelAutoFill}
      />

      {/* Confirmation modal for Sample button */}
      <ConfirmationModal
        isOpen={showSampleConfirm}
        message="This will replace your current content with sample data. Do you want to proceed?"
        onConfirm={confirmSampleData}
        onCancel={() => setShowSampleConfirm(false)}
      />

      {/* AI Preview Popup (full-page via portal with transparent background) */}
      <AIPreviewModal
        isOpen={showAIPreview}
        aiResult={aiResult}
        onAdd={handleAIPreviewAdd}
        onCancel={handleAIPreviewCancelClick} // triggers AI cancel confirmation
      />

      {/* Confirmation modal for AI Preview cancel */}
      <ConfirmationModal
        isOpen={showAICancelConfirm}
        message="Cancelling will discard the AI generated content. Do you want to proceed?"
        onConfirm={confirmAICancel}
        onCancel={cancelAICancel}
      />
    </div>
  );
};

ProjectsSection.propTypes = {
  sectionId: PropTypes.number.isRequired,
  finalMode: PropTypes.bool,
};

export default ProjectsSection;
