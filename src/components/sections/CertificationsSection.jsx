// src/components/CertificationsSection.jsx
import { useContext, useState } from "react";
import PropTypes from "prop-types";
import { FiAward, FiEdit2, FiZap } from "react-icons/fi"; // Using FiAward for certifications icon
import { ResumeContext } from "../../context/resume-context";
import Loader from "../common/Loader";

const CertificationsSection = ({ sectionId, finalMode = false }) => {
  const { sectionsData, updateSectionContent } = useContext(ResumeContext);

  // Initialize certifications as an array.
  const initialCertifications = Array.isArray(
    sectionsData[sectionId]?.content.certifications
  )
    ? sectionsData[sectionId].content.certifications
    : sectionsData[sectionId]?.content.certifications
    ? [sectionsData[sectionId].content.certifications]
    : [""];

  const [certifications, setCertifications] = useState(initialCertifications);
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");

  // Update a specific certification entry.
  const handleCertificationChange = (index, value) => {
    const newCertifications = [...certifications];
    newCertifications[index] = value;
    setCertifications(newCertifications);
  };

  // Save changes to the global context and exit edit mode.
  const handleSave = () => {
    updateSectionContent(sectionId, { certifications });
    setIsEditing(false);
  };

  // Add a new empty certification entry without toggling edit mode.
  const handleAddMore = () => {
    setCertifications((prev) => [...prev, ""]);
  };

  // Simulated API call to generate AI-enhanced certifications data.
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
                certifications: [
                  "AWS Certified Developer",
                  "PMP Certification",
                  "Scrum Master",
                ],
              },
            }),
          1500
        )
      );
      setCertifications(response.data.certifications);
      updateSectionContent(sectionId, {
        certifications: response.data.certifications,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to generate AI certifications data. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Simulated API call to fetch certifications data when dragging the component.
  const fetchCertificationsData = async () => {
    try {
      setIsFetching(true);
      setError("");
      // Simulated API call – replace with your actual endpoint.
      const response = await new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              data: {
                certifications: [
                  "Certified Information Systems Security Professional (CISSP)",
                  "Google Cloud Certified - Professional Cloud Architect",
                ],
              },
            }),
          1500
        )
      );
      setCertifications(response.data.certifications);
      updateSectionContent(sectionId, {
        certifications: response.data.certifications,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to fetch certifications data. Please try again.");
    } finally {
      setIsFetching(false);
    }
  };

  // ----------------------
  // Final (Preview) Mode: Read-Only Display
  // ----------------------
  if (finalMode) {
    return (
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Certifications
        </h3>
        <ul className="list-disc pl-5 text-gray-700">
          {certifications.map((cert, index) => (
            <li key={index}>{cert || "N/A"}</li>
          ))}
        </ul>
      </div>
    );
  }

  // ----------------------
  // Editable / View Mode: Display with Action Buttons and Inputs
  // ----------------------
  return (
    <div
      className="relative group border-l-4 border-blue-500 bg-gray-50 rounded-lg p-6 mb-6 transition-all hover:bg-gray-50/80"
      draggable
      onDragStart={fetchCertificationsData} // Dragging auto-fills certifications data.
    >
      {/* Header Row with Icon, Title, and Action Buttons */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <FiAward className="w-6 h-6 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-800">
            Certifications
          </h3>
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

      {/* Editable / View Content */}
      {isEditing ? (
        <div>
          {certifications.map((cert, index) => (
            <div key={index} className="mb-4 border-b pb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Certification {index + 1}
              </label>
              <input
                type="text"
                placeholder="Enter certification"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={cert}
                onChange={(e) =>
                  handleCertificationChange(index, e.target.value)
                }
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
            {certifications.map((cert, index) => (
              <li key={index}>{cert || "Click to add certification"}</li>
            ))}
          </ul>
          <div className="mt-2 text-sm text-gray-400">
            Click to edit – Drag to auto-fill certifications data available
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

CertificationsSection.propTypes = {
  sectionId: PropTypes.number.isRequired,
  finalMode: PropTypes.bool,
};

export default CertificationsSection;
