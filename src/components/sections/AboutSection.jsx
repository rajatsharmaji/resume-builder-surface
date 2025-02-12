import { useContext, useState } from "react";
import PropTypes from "prop-types";
import { FiUser, FiEdit2, FiStar } from "react-icons/fi"; // Replaced FiSparkles with FiStar
import { ResumeContext } from "../../context/resume-context";
import Loader from "../common/Loader";

const AboutSection = ({ sectionId, finalMode = false }) => {
  const { sectionsData, updateSectionContent } = useContext(ResumeContext);
  const initialValue = sectionsData[sectionId]?.content.about || "";
  const [about, setAbout] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  // Generate AI-powered about section
  const generateAIContent = async () => {
    try {
      setIsGenerating(true);
      setError("");

      // Simulated API call - replace with your actual API endpoint
      const response = await new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              data: {
                content:
                  "Experienced software engineer with 5+ years in full-stack development. Specialized in React, Node.js, and cloud technologies. Passionate about creating scalable solutions and mentoring junior developers. Strong advocate for clean code and agile practices.",
              },
            }),
          1500
        )
      );

      setAbout(response.data.content);
      updateSectionContent(sectionId, { about: response.data.content });
    } catch (err) {
      console.error(err);
      setError("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    updateSectionContent(sectionId, { about });
    setIsEditing(false);
  };

  if (finalMode) {
    return (
      <div className="mb-6 group relative">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 border-l-4 border-blue-500 pl-3">
          Professional Profile
        </h3>
        <p className="text-gray-700 text-justify leading-relaxed">
          {about || "Experienced professional with demonstrated expertise..."}
        </p>
      </div>
    );
  }

  return (
    <div className="relative group border-l-4 border-blue-500 bg-gray-50 rounded-lg p-6 mb-6 transition-all hover:bg-gray-50/80">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <FiUser className="w-6 h-6 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-800">About Me</h3>
        </div>

        <div className="flex gap-2">
          <button
            onClick={generateAIContent}
            disabled={isGenerating}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
          >
            {isGenerating ? (
              <Loader size="sm" />
            ) : (
              <>
                <FiStar className="w-4 h-4" />
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
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            rows="4"
            placeholder="Describe your professional experience, skills, and achievements..."
          />
          <button
            onClick={handleSave}
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      ) : (
        <div
          className="prose max-w-none cursor-text"
          onClick={() => setIsEditing(true)}
        >
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {about ||
              "Click the edit button to add your professional summary..."}
          </p>
          <div className="mt-2 text-sm text-gray-400">
            Click to edit - AI Enhance available
          </div>
        </div>
      )}
    </div>
  );
};

AboutSection.propTypes = {
  sectionId: PropTypes.number.isRequired,
  finalMode: PropTypes.bool,
};

export default AboutSection;
