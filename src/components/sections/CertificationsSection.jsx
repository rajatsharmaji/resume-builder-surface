// src/components/CertificationsSection.jsx
import { useContext, useState } from "react";
import PropTypes from "prop-types";
import { FiAward, FiEdit2 } from "react-icons/fi"; // Using FiAward for certifications icon
import { FaMagic } from "react-icons/fa";
import { AiFillThunderbolt } from "react-icons/ai";
import axios from "axios";
import { ResumeContext } from "../../context/resume-context";
import Loader from "../common/Loader";
import ConfirmationModal from "../common/ConfirmationModal";
import AIPreviewModal from "../common/AIPreviewModal";
import * as Yup from "yup";

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
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  // New state for AI preview and sample confirmation.
  const [aiResult, setAiResult] = useState("");
  const [aiIndex, setAiIndex] = useState(null);
  const [showAIPreview, setShowAIPreview] = useState(false);
  const [showSampleConfirm, setShowSampleConfirm] = useState(false);
  const [sampleIndex, setSampleIndex] = useState(null);
  const [showAICancelConfirm, setShowAICancelConfirm] = useState(false);
  const [generatingDescIndex, setGeneratingDescIndex] = useState(null);

  // Certification suggestions for auto-suggestion.
  const certificationSuggestions = [
    "AWS Certified Developer",
    "Certified Information Systems Security Professional (CISSP)",
    "Google Cloud Certified - Professional Cloud Architect",
    "PMP Certification",
    "Scrum Master",
  ];

  // Yup validation schema for certifications.
  const certificationsSchema = Yup.array()
    .of(
      Yup.string()
        .required("Certification cannot be empty")
        .min(3, "Certification must be at least 3 characters")
    )
    .min(1, "At least one certification is required");

  // Update a specific certification entry.
  const handleCertificationChange = (index, value) => {
    const newCertifications = [...certifications];
    newCertifications[index] = value;
    setCertifications(newCertifications);
  };

  // Save changes after validating, then update the context and exit edit mode.
  const handleSave = () => {
    certificationsSchema
      .validate(certifications, { abortEarly: false })
      .then(() => {
        updateSectionContent(sectionId, { certifications });
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

  // Add a new empty certification entry (visible only in edit mode).
  const handleAddMore = () => {
    setCertifications((prev) => [...prev, ""]);
  };

  // Simulated API call to fetch certifications data via drag-to-auto-fill.
  const fetchCertificationsData = async () => {
    try {
      setIsFetching(true);
      setError("");
      // Simulated API call – replace with your actual endpoint if needed.
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

  // When dragging in non-edit mode, show the confirmation modal.
  const handleDragStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirmation(true);
  };

  // Confirm auto-fill sample data.
  const confirmAutoFill = () => {
    setShowConfirmation(false);
    fetchCertificationsData();
  };

  // Cancel auto-fill.
  const cancelAutoFill = () => {
    setShowConfirmation(false);
  };

  // ----- SAMPLE DATA CONFIRMATION -----
  const confirmSampleData = () => {
    const sampleText =
      "Certified in advanced cloud computing and security best practices.";
    if (sampleIndex !== null) {
      setCertifications((prev) => {
        const newCerts = [...prev];
        newCerts[sampleIndex] = sampleText;
        return newCerts;
      });
    }
    setShowSampleConfirm(false);
    setSampleIndex(null);
  };

  // ----- AI ENHANCEMENT HANDLERS -----
  const handleCertificationAIDesc = async (index, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    try {
      setGeneratingDescIndex(index);
      setAiIndex(index);
      setError("");
      // Call the API to generate AI certification data. Replace the URL with your actual endpoint.
      const response = await axios.post(
        "http://localhost:3008/api/v1/ai/certifications",
        { text: certifications[index] }
      );
      setAiResult(response.data.result);
      setShowAIPreview(true);
    } catch (err) {
      console.error(err);
      setError("Failed to generate certification data. Please try again.");
    } finally {
      setGeneratingDescIndex(null);
    }
  };

  const handleAIPreviewAdd = () => {
    if (aiIndex !== null) {
      setCertifications((prev) => {
        const newCerts = [...prev];
        newCerts[aiIndex] = aiResult;
        return newCerts;
      });
    }
    setShowAIPreview(false);
    setAiIndex(null);
    setAiResult("");
  };

  const handleAIPreviewCancelClick = () => {
    setShowAIPreview(false);
    setShowAICancelConfirm(true);
  };

  const confirmAICancel = () => {
    setShowAICancelConfirm(false);
  };

  const cancelAICancel = () => {
    setShowAICancelConfirm(false);
    setShowAIPreview(true);
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
  // Editable / View Mode
  // ----------------------
  return (
    <div
      className="relative group border-l-4 border-blue-500 bg-white shadow-lg rounded-lg p-8 mb-6 transition-transform duration-200 hover:scale-105"
      draggable={!isEditing}
      onDragStart={!isEditing ? handleDragStart : undefined}
    >
      {/* Loader overlay when auto-fill is in progress */}
      {!isEditing && isFetching && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">
          <Loader size="lg" />
        </div>
      )}

      {/* Header Row with Icon, Title, and Edit Button */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <FiAward className="w-6 h-6 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-800">
            Certifications
          </h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiEdit2 className="w-5 h-5" />
          </button>
        </div>
      </div>

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
                list={`cert-suggestions-${index}`}
              />
              <datalist id={`cert-suggestions-${index}`}>
                {certificationSuggestions.map((suggestion, i) => (
                  <option key={i} value={suggestion} />
                ))}
              </datalist>
              <div className="flex gap-3 mt-2">
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
                  onClick={(e) => handleCertificationAIDesc(index, e)}
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
            </div>
          ))}
          {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
          <div className="flex justify-between items-center">
            <button
              onClick={handleSave}
              className="mt-3 px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={handleAddMore}
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Add More
            </button>
          </div>
        </div>
      ) : (
        // Preview view (click anywhere to edit)
        <div className="cursor-text" onClick={() => setIsEditing(true)}>
          <ul className="list-disc pl-5 text-gray-700">
            {certifications.map((cert, index) => (
              <li key={index}>{cert || "Click to add certification"}</li>
            ))}
          </ul>
          <div className="mt-2 text-sm text-gray-400">
            Click to edit – Drag to auto-fill sample data
          </div>
        </div>
      )}

      {/* Global modals rendered via portals */}
      <ConfirmationModal
        isOpen={showConfirmation}
        message="This will replace all previous data with sample data. Do you want to proceed?"
        onConfirm={confirmAutoFill}
        onCancel={cancelAutoFill}
      />

      <ConfirmationModal
        isOpen={showSampleConfirm}
        message="This will replace your current certification with sample data. Do you want to proceed?"
        onConfirm={confirmSampleData}
        onCancel={() => setShowSampleConfirm(false)}
      />

      <AIPreviewModal
        isOpen={showAIPreview}
        aiResult={aiResult}
        onAdd={handleAIPreviewAdd}
        onCancel={handleAIPreviewCancelClick} // triggers AI cancel confirmation
      />

      <ConfirmationModal
        isOpen={showAICancelConfirm}
        message="Cancelling will discard the AI generated content. Do you want to proceed?"
        onConfirm={confirmAICancel}
        onCancel={cancelAICancel}
      />
    </div>
  );
};

CertificationsSection.propTypes = {
  sectionId: PropTypes.number.isRequired,
  finalMode: PropTypes.bool,
};

export default CertificationsSection;
