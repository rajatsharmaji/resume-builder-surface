// src/components/ExperienceSection.jsx
import { useContext, useState } from "react";
import PropTypes from "prop-types";
import { FiBriefcase, FiEdit2, FiZap } from "react-icons/fi"; // FiZap for AI Enhance
import { ResumeContext } from "../../context/resume-context";
import Loader from "../common/Loader";

const ExperienceSection = ({ sectionId, finalMode = false }) => {
  const { sectionsData, updateSectionContent } = useContext(ResumeContext);

  // Ensure experience data is stored as an array
  const initialExperienceData = sectionsData[sectionId]?.content.experience;
  const initialExperience = Array.isArray(initialExperienceData)
    ? initialExperienceData
    : initialExperienceData
    ? [initialExperienceData]
    : [{ company: "", role: "", description: "" }];

  const [experience, setExperience] = useState(initialExperience);
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFetchingExperience, setIsFetchingExperience] = useState(false);
  const [error, setError] = useState("");

  // Update a specific experience entry field
  const handleEntryChange = (index, field, value) => {
    const newExperience = [...experience];
    newExperience[index] = { ...newExperience[index], [field]: value };
    setExperience(newExperience);
  };

  // Save updates to the global context and exit editing mode
  const handleSave = () => {
    updateSectionContent(sectionId, { experience });
    setIsEditing(false);
  };

  // Add a new empty experience entry
  const handleAddMore = () => {
    setExperience((prev) => [
      ...prev,
      { company: "", role: "", description: "" },
    ]);
  };

  // Simulated API call for AI-enhanced experience data
  const generateAIContent = async () => {
    try {
      setIsGenerating(true);
      setError("");
      const response = await new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              data: {
                experience: [
                  {
                    company: "Google",
                    role: "Software Engineer",
                    description:
                      "Developed scalable search algorithms and optimized backend services.",
                  },
                  {
                    company: "Facebook",
                    role: "Frontend Developer",
                    description:
                      "Built user interfaces with React and improved UI performance.",
                  },
                ],
              },
            }),
          1500
        )
      );
      setExperience(response.data.experience);
      updateSectionContent(sectionId, {
        experience: response.data.experience,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to generate AI experience data. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Simulated API call to fetch experience data when dragging the component
  const fetchExperienceData = async () => {
    try {
      setIsFetchingExperience(true);
      setError("");
      const response = await new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              data: {
                experience: [
                  {
                    company: "Amazon",
                    role: "DevOps Engineer",
                    description:
                      "Managed cloud infrastructure and automated deployment pipelines.",
                  },
                ],
              },
            }),
          1500
        )
      );
      setExperience(response.data.experience);
      updateSectionContent(sectionId, {
        experience: response.data.experience,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to fetch experience data. Please try again.");
    } finally {
      setIsFetchingExperience(false);
    }
  };

  // Final (preview) mode: display plain text experience details
  if (finalMode) {
    return (
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Work Experience
        </h3>
        {experience.map((entry, index) => (
          <div key={index} className="mb-4">
            <p className="text-gray-700">
              <strong>Company:</strong> {entry.company || "N/A"}
            </p>
            <p className="text-gray-700">
              <strong>Role:</strong> {entry.role || "N/A"}
            </p>
            <p className="text-gray-700">
              <strong>Description:</strong> {entry.description || "N/A"}
            </p>
          </div>
        ))}
      </div>
    );
  }

  // Editable mode: a resume-style UI with preview and edit modes
  return (
    <div
      className="relative group border-l-4 border-blue-500 bg-gray-50 rounded-lg p-6 mb-6 transition-all hover:bg-gray-50/80"
      draggable
      onDragStart={fetchExperienceData}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <FiBriefcase className="w-6 h-6 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-800">
            Work Experience
          </h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={generateAIContent}
            disabled={isGenerating || isFetchingExperience}
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

      {isEditing ? (
        <div className="relative">
          {experience.map((entry, index) => (
            <div key={index} className="mb-4 border-b pb-4">
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your company name"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={entry.company}
                  onChange={(e) =>
                    handleEntryChange(index, "company", e.target.value)
                  }
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  placeholder="Enter your role"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={entry.role}
                  onChange={(e) =>
                    handleEntryChange(index, "role", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Describe your responsibilities and achievements..."
                  className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  value={entry.description}
                  onChange={(e) =>
                    handleEntryChange(index, "description", e.target.value)
                  }
                ></textarea>
              </div>
            </div>
          ))}
          <button
            onClick={handleSave}
            className="mt-3 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      ) : (
        <div className="cursor-text" onClick={() => setIsEditing(true)}>
          {experience.map((entry, index) => (
            <div key={index} className="mb-4">
              <p className="text-gray-700">
                <strong>Company:</strong>{" "}
                {entry.company || "Click to add company name"}
              </p>
              <p className="text-gray-700">
                <strong>Role:</strong> {entry.role || "Click to add your role"}
              </p>
              <p className="text-gray-700">
                <strong>Description:</strong>{" "}
                {entry.description || "Click to add description"}
              </p>
            </div>
          ))}
          <div className="mt-2 text-sm text-gray-400">
            Click to edit – Drag to auto-fill experience data available
          </div>
        </div>
      )}

      {/* "Add More" button is always visible */}
      <button
        onClick={handleAddMore}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Add More
      </button>
    </div>
  );
};

ExperienceSection.propTypes = {
  sectionId: PropTypes.number.isRequired,
  finalMode: PropTypes.bool,
};

export default ExperienceSection;
