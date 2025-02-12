// src/components/EducationSection.jsx
import { useContext, useState } from "react";
import PropTypes from "prop-types";
import { FiBook, FiEdit2, FiZap } from "react-icons/fi"; // FiZap used for the AI Enhance button
import { ResumeContext } from "../../context/resume-context";
import Loader from "../common/Loader";

const EducationSection = ({ sectionId, finalMode = false }) => {
  const { sectionsData, updateSectionContent } = useContext(ResumeContext);

  // Initialize education as an array.
  const initialEducation = Array.isArray(
    sectionsData[sectionId]?.content.education
  )
    ? sectionsData[sectionId]?.content.education
    : sectionsData[sectionId]?.content.education
    ? [sectionsData[sectionId]?.content.education]
    : [{ school: "", degree: "", year: "" }];

  const [education, setEducation] = useState(initialEducation);
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFetchingCollege, setIsFetchingCollege] = useState(false);
  const [error, setError] = useState("");

  // Handle changes for a specific education entry
  const handleEntryChange = (index, field, value) => {
    const newEducation = [...education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setEducation(newEducation);
  };

  // Save updates to the global context and exit editing mode
  const handleSave = () => {
    updateSectionContent(sectionId, { education });
    setIsEditing(false);
  };

  // Add a new empty education entry
  const handleAddMore = () => {
    setEducation((prev) => [...prev, { school: "", degree: "", year: "" }]);
  };

  // Simulate AI Enhance API call to generate education details
  const generateAIContent = async () => {
    try {
      setIsGenerating(true);
      setError("");
      // Simulated API call (replace with your real endpoint)
      const response = await new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              data: {
                education: [
                  {
                    school: "Harvard University",
                    degree: "B.A. in Economics",
                    year: "2015",
                  },
                  {
                    school: "MIT",
                    degree: "M.Sc. in Data Science",
                    year: "2017",
                  },
                ],
              },
            }),
          1500
        )
      );
      setEducation(response.data.education);
      updateSectionContent(sectionId, { education: response.data.education });
    } catch (err) {
      console.error(err);
      setError("Failed to generate AI education data. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Simulate API call to fetch college data automatically when dragging the component
  const fetchCollegeData = async () => {
    try {
      setIsFetchingCollege(true);
      setError("");
      // Simulated API call (replace with your real endpoint)
      const response = await new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              data: {
                education: [
                  {
                    school: "Stanford University",
                    degree: "B.Sc. in Computer Science",
                    year: "2018",
                  },
                ],
              },
            }),
          1500
        )
      );
      setEducation(response.data.education);
      updateSectionContent(sectionId, { education: response.data.education });
    } catch (err) {
      console.error(err);
      setError("Failed to fetch college data. Please try again.");
    } finally {
      setIsFetchingCollege(false);
    }
  };

  // Final (preview) mode: simply display the education details
  if (finalMode) {
    return (
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Education</h3>
        {education.map((entry, index) => (
          <div key={index} className="mb-4">
            <p className="text-gray-700">
              <strong>School:</strong> {entry.school || "N/A"}
            </p>
            <p className="text-gray-700">
              <strong>Degree:</strong> {entry.degree || "N/A"}
            </p>
            <p className="text-gray-700">
              <strong>Year:</strong> {entry.year || "N/A"}
            </p>
          </div>
        ))}
      </div>
    );
  }

  // Editable mode: a cool, professional UI similar to the About section.
  return (
    <div
      className="relative group border-l-4 border-blue-500 bg-gray-50 rounded-lg p-6 mb-6 transition-all hover:bg-gray-50/80"
      draggable
      onDragStart={fetchCollegeData} // Dragging the component will auto-fill with college data
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <FiBook className="w-6 h-6 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-800">Education</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={generateAIContent}
            disabled={isGenerating || isFetchingCollege}
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
          {education.map((entry, index) => (
            <div key={index} className="mb-4 border-b pb-4">
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  School
                </label>
                <input
                  type="text"
                  placeholder="Enter your school name"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={entry.school}
                  onChange={(e) =>
                    handleEntryChange(index, "school", e.target.value)
                  }
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Degree
                </label>
                <input
                  type="text"
                  placeholder="Enter your degree"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={entry.degree}
                  onChange={(e) =>
                    handleEntryChange(index, "degree", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Year
                </label>
                <input
                  type="text"
                  placeholder="Enter graduation year"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={entry.year}
                  onChange={(e) =>
                    handleEntryChange(index, "year", e.target.value)
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
          {education.map((entry, index) => (
            <div key={index} className="mb-4">
              <p className="text-gray-700">
                <strong>School:</strong>{" "}
                {entry.school || "Click to add your school name"}
              </p>
              <p className="text-gray-700">
                <strong>Degree:</strong>{" "}
                {entry.degree || "Click to add your degree"}
              </p>
              <p className="text-gray-700">
                <strong>Year:</strong>{" "}
                {entry.year || "Click to add your graduation year"}
              </p>
            </div>
          ))}
          <div className="mt-2 text-sm text-gray-400">
            Click to edit – Drag to auto-fill college data available
          </div>
        </div>
      )}

      {/* Button to add more education entries */}
      <button
        onClick={handleAddMore}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Add More
      </button>
    </div>
  );
};

EducationSection.propTypes = {
  sectionId: PropTypes.number.isRequired,
  finalMode: PropTypes.bool,
};

export default EducationSection;
