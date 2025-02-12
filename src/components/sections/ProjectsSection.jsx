// src/components/ProjectsSection.jsx
import { useContext, useState } from "react";
import PropTypes from "prop-types";
import { FiCode, FiLink, FiEdit2, FiZap } from "react-icons/fi"; // FiCode for project icon, FiZap for AI Enhance, FiEdit2 for editing, FiLink for link icon
import { ResumeContext } from "../../context/resume-context";
import Loader from "../common/Loader";

const ProjectsSection = ({ sectionId, finalMode = false }) => {
  const { sectionsData, updateSectionContent } = useContext(ResumeContext);

  // Initialize projects as an array.
  const initialProjects = Array.isArray(
    sectionsData[sectionId]?.content?.projects
  )
    ? sectionsData[sectionId].content.projects
    : sectionsData[sectionId]?.content?.projects
    ? [sectionsData[sectionId].content.projects]
    : [{ title: "", description: "", link: "" }];

  const [projects, setProjects] = useState(initialProjects);
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");

  // Update a specific project entry.
  const handleProjectChange = (index, field, value) => {
    const newProjects = [...projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    setProjects(newProjects);
  };

  // Save changes to the global context and exit edit mode.
  const handleSave = () => {
    updateSectionContent(sectionId, { projects });
    setIsEditing(false);
  };

  // Add a new empty project entry (without toggling edit mode).
  const handleAddMore = () => {
    setProjects((prev) => [...prev, { title: "", description: "", link: "" }]);
  };

  // Simulated API call to generate AI-enhanced projects data.
  const generateAIContent = async () => {
    try {
      setIsGenerating(true);
      setError("");
      // Simulated API call – replace with your actual endpoint.
      const response = await new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              data: {
                projects: [
                  {
                    title: "Project Alpha",
                    description:
                      "A groundbreaking project integrating AI and machine learning to optimize workflows.",
                    link: "https://alpha.example.com",
                  },
                  {
                    title: "Project Beta",
                    description:
                      "An innovative web application built with React and Node.js, delivering seamless user experiences.",
                    link: "https://beta.example.com",
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
      setError("Failed to generate AI projects data. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Simulated API call to fetch projects data when dragging the component.
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

  // Final (preview) mode: read-only display.
  if (finalMode) {
    return (
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Projects</h3>
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

  // Editable / View mode.
  return (
    <div
      className="relative group border-l-4 border-blue-500 bg-gray-50 rounded-lg p-6 mb-6 transition-all hover:bg-gray-50/80"
      draggable
      onDragStart={fetchProjectsData} // Dragging auto-fills projects data.
    >
      {/* Header Row with Icon, Title, and Action Buttons */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <FiCode className="w-6 h-6 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-800">Projects</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={generateAIContent}
            disabled={isGenerating || isFetching}
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

      {/* Content Area */}
      {isEditing ? (
        <div>
          {projects.map((proj, index) => (
            <div key={index} className="mb-4 border-b pb-4">
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  placeholder="Enter project title"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={proj.title}
                  onChange={(e) =>
                    handleProjectChange(index, "title", e.target.value)
                  }
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Project Description
                </label>
                <textarea
                  placeholder="Enter project description"
                  className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  value={proj.description}
                  onChange={(e) =>
                    handleProjectChange(index, "description", e.target.value)
                  }
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                  <FiLink size={16} className="text-gray-500" />
                  Project Link (optional)
                </label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={proj.link}
                  onChange={(e) =>
                    handleProjectChange(index, "link", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
          <button
            onClick={handleSave}
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Save Changes
          </button>
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
            Click to edit – Drag to auto-fill projects data available
          </div>
        </div>
      )}

      {/* "Add More" Button (Always Visible) */}
      <div className="mt-4">
        <button
          onClick={handleAddMore}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Add More
        </button>
      </div>
    </div>
  );
};

ProjectsSection.propTypes = {
  sectionId: PropTypes.number.isRequired,
  finalMode: PropTypes.bool,
};

export default ProjectsSection;
