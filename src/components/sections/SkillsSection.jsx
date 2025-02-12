// src/components/SkillsSection.jsx
import { useContext, useState } from "react";
import PropTypes from "prop-types";
import { FiCode, FiEdit2, FiZap } from "react-icons/fi"; // FiCode for skills icon, FiZap for AI Enhance, FiEdit2 for edit mode
import { ResumeContext } from "../../context/resume-context";
import Loader from "../common/Loader";

const SkillsSection = ({ sectionId, finalMode = false }) => {
  const { sectionsData, updateSectionContent } = useContext(ResumeContext);

  // Initialize skills as an array.
  // If the stored value is a string, split it into an array by commas.
  const storedSkills = sectionsData[sectionId]?.content?.skills;
  let initialSkillsArray;
  if (Array.isArray(storedSkills)) {
    initialSkillsArray = storedSkills;
  } else if (typeof storedSkills === "string" && storedSkills.trim() !== "") {
    initialSkillsArray = storedSkills.split(",").map((skill) => skill.trim());
  } else {
    initialSkillsArray = [""];
  }

  const [skills, setSkills] = useState(initialSkillsArray);
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");

  // Handle change for a specific skill entry.
  const handleSkillChange = (index, value) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    setSkills(newSkills);
  };

  // Save changes to the global context.
  const handleSave = () => {
    updateSectionContent(sectionId, { skills });
    setIsEditing(false);
  };

  // Add a new empty skill entry (without toggling edit mode).
  const handleAddMore = () => {
    setSkills((prev) => [...prev, ""]);
  };

  // Simulated API call to generate AI-enhanced skills data.
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
                skills: ["React", "JavaScript", "Node.js", "CSS"],
              },
            }),
          1500
        )
      );
      setSkills(response.data.skills);
      updateSectionContent(sectionId, { skills: response.data.skills });
    } catch (err) {
      console.error(err);
      setError("Failed to generate AI skills data. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Simulated API call to fetch skills data when dragging the component.
  const fetchSkillsData = async () => {
    try {
      setIsFetching(true);
      setError("");
      // Simulated API call – replace with your actual endpoint.
      const response = await new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              data: {
                skills: ["TypeScript", "GraphQL", "Docker", "Kubernetes"],
              },
            }),
          1500
        )
      );
      setSkills(response.data.skills);
      updateSectionContent(sectionId, { skills: response.data.skills });
    } catch (err) {
      console.error(err);
      setError("Failed to fetch skills data. Please try again.");
    } finally {
      setIsFetching(false);
    }
  };

  // Final (preview) mode: display skills as a read-only bullet list.
  if (finalMode) {
    return (
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Skills</h3>
        <ul className="list-disc pl-5 text-gray-700">
          {skills.map((skill, index) => (
            <li key={index}>{skill || "N/A"}</li>
          ))}
        </ul>
      </div>
    );
  }

  // Editable / View Mode: display content with action buttons.
  return (
    <div
      className="relative group border-l-4 border-blue-500 bg-gray-50 rounded-lg p-6 mb-6 transition-all hover:bg-gray-50/80"
      draggable
      onDragStart={fetchSkillsData} // Dragging auto-fills skills data.
    >
      {/* Header Row with Icon, Title, and Action Buttons */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <FiCode className="w-6 h-6 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-800">Skills</h3>
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
          {skills.map((skill, index) => (
            <div key={index} className="mb-4 border-b pb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Skill {index + 1}
              </label>
              <input
                type="text"
                placeholder="Enter skill"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={skill}
                onChange={(e) => handleSkillChange(index, e.target.value)}
              />
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
          <ul className="list-disc pl-5 text-gray-700">
            {skills.map((skill, index) => (
              <li key={index}>{skill || "Click to add skill"}</li>
            ))}
          </ul>
          <div className="mt-2 text-sm text-gray-400">
            Click to edit – Drag to auto-fill skills data available
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

SkillsSection.propTypes = {
  sectionId: PropTypes.number.isRequired,
  finalMode: PropTypes.bool,
};

export default SkillsSection;
