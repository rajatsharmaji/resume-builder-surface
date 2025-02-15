// src/components/SkillsSection.jsx
import { useContext, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { FiCode, FiEdit2, FiZap } from "react-icons/fi";
import { ResumeContext } from "../../context/resume-context";
import Loader from "../common/Loader";
import * as Yup from "yup";
import ConfirmationModal from "../common/ConfirmationModal";

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
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Suggested skills for the datalist.
  const skillSuggestions = [
    "JavaScript",
    "React",
    "Node.js",
    "CSS",
    "HTML",
    "TypeScript",
    "GraphQL",
    "Docker",
    "Kubernetes",
    "Redux",
    "Sass",
    "Tailwind CSS",
  ];

  // Yup validation schema: each skill must be at least 2 characters long and not empty.
  const skillsSchema = Yup.array().of(
    Yup.string()
      .trim()
      .min(2, "Skill must be at least 2 characters")
      .required("Skill is required")
  );

  // Handle change for a specific skill entry.
  const handleSkillChange = useCallback(
    (index, value) => {
      const newSkills = [...skills];
      newSkills[index] = value;
      setSkills(newSkills);
    },
    [skills]
  );

  // Save changes after validation.
  const handleSave = useCallback(() => {
    skillsSchema
      .validate(skills, { abortEarly: false })
      .then(() => {
        updateSectionContent(sectionId, { skills });
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
  }, [skills, skillsSchema, updateSectionContent, sectionId]);

  // Add a new empty skill entry.
  const handleAddMore = useCallback(() => {
    setSkills((prev) => [...prev, ""]);
  }, []);

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

  // Handle drag-to-auto-fill by showing the confirmation modal.
  const handleDragStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirmation(true);
  };

  // Confirm auto-fill sample data.
  const confirmAutoFill = () => {
    setShowConfirmation(false);
    fetchSkillsData();
  };

  // Cancel auto-fill.
  const cancelAutoFill = () => {
    setShowConfirmation(false);
  };

  // Final (read-only) mode: display skills as a bullet list.
  if (finalMode) {
    return (
      <div className="mb-6 p-6 bg-white shadow rounded">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Skills</h3>
        <ul className="list-disc pl-5 text-gray-700">
          {skills.map((skill, index) => (
            <li key={index}>{skill || "N/A"}</li>
          ))}
        </ul>
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
      {/* Loader overlay when fetching skills data */}
      {isFetching && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">
          <Loader size="lg" />
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <FiCode className="w-7 h-7 text-blue-500" />
          <h3 className="text-2xl font-semibold text-gray-800">Skills</h3>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
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
                onClick={() => setIsEditing(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiEdit2 className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiEdit2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Error Message above the Save Changes button (only in edit mode) */}
      {isEditing && error && (
        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded shadow">
          {error}
        </div>
      )}

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
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                value={skill}
                onChange={(e) => handleSkillChange(index, e.target.value)}
                list={`skill-suggestions-${index}`}
              />
              <datalist id={`skill-suggestions-${index}`}>
                {skillSuggestions.map((skillOption, i) => (
                  <option key={i} value={skillOption} />
                ))}
              </datalist>
            </div>
          ))}
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
          <ul className="list-disc pl-5 text-gray-700">
            {skills.map((skill, index) => (
              <li key={index}>{skill || "Click to add skill"}</li>
            ))}
          </ul>
          <div className="mt-2 text-sm text-gray-400">
            Click to edit – Drag to auto-fill sample data
          </div>
        </div>
      )}

      {/* Global confirmation modal rendered via portal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        message="This will replace all previous data with sample data. Do you want to proceed?"
        onConfirm={confirmAutoFill}
        onCancel={cancelAutoFill}
      />
    </div>
  );
};

SkillsSection.propTypes = {
  sectionId: PropTypes.number.isRequired,
  finalMode: PropTypes.bool,
};

export default SkillsSection;
