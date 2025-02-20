// src/components/AboutSection.jsx
import { useContext, useState } from "react";
import PropTypes from "prop-types";
import { FiUser, FiEdit2 } from "react-icons/fi";
import { AiFillThunderbolt } from "react-icons/ai";
import { FaMagic } from "react-icons/fa";
import axios from "axios";
import * as Yup from "yup";
import { ResumeContext } from "../../../../shared/context/resume-context";
import Loader from "../../../../shared/components/Loader";
import ConfirmationModal from "../../../../shared/components/ConfirmationModal";
import AIPreviewModal from "../../../../shared/components/AIPreviewModal";

const AboutSection = ({ sectionId, finalMode = false }) => {
  const { sectionsData, updateSectionContent } = useContext(ResumeContext);
  const initialValue = sectionsData[sectionId]?.content.about || "";
  const [about, setAbout] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  // New state for AI content preview and confirmation
  const [aiResult, setAiResult] = useState("");
  const [showAIPreview, setShowAIPreview] = useState(false);
  const [showAIReplaceAlert, setShowAIReplaceAlert] = useState(false);

  // New state for Sample confirmation modal and AI cancel confirmation modal
  const [showSampleConfirm, setShowSampleConfirm] = useState(false);
  const [showAICancelConfirm, setShowAICancelConfirm] = useState(false);

  // Yup validation schema for the About section.
  const aboutSchema = Yup.string()
    .required("About section cannot be empty")
    .min(10, "About section must be at least 10 characters");

  // Function to insert sample data (without event parameter)
  const confirmSampleData = () => {
    const sampleData =
      "Passionate software engineer with expertise in full-stack development, cloud computing, and agile methodologies.";
    setAbout(sampleData);
    setShowSampleConfirm(false);
    // Note: Context is updated only on save.
  };

  // Function to call AI to enhance content.
  const generateAIContent = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsGenerating(true);
      setError("");
      const response = await axios.post(
        "http://localhost:3008/api/v1/ai/about",
        { text: about }
      );
      const result = response.data.result;
      // Instead of directly setting the about content, show it in a full-page AI preview popup.
      setAiResult(result);
      setShowAIPreview(true);
      // Update context only on save.
    } catch (err) {
      console.error(err);
      setError("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to fetch sample "about" data via drag-to-auto-fill.
  const fetchAboutData = async () => {
    try {
      setIsGenerating(true);
      setError("");
      // Simulated API call – replace with your real endpoint if needed.
      const response = await new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              data: {
                about:
                  "Experienced professional with a proven track record in software development, innovative problem-solving, and team leadership.",
              },
            }),
          1500
        )
      );
      const sampleAbout = response.data.about;
      setAbout(sampleAbout);
      updateSectionContent(sectionId, { about: sampleAbout });
    } catch (err) {
      console.error(err);
      setError("Failed to auto-fill about data. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle save with validation.
  const handleSave = () => {
    aboutSchema
      .validate(about)
      .then(() => {
        updateSectionContent(sectionId, { about });
        setIsEditing(false);
        setError("");
      })
      .catch((validationError) => {
        setError(validationError.message);
      });
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
    fetchAboutData();
  };

  // Cancel auto-fill.
  const cancelAutoFill = () => {
    setShowConfirmation(false);
  };

  // --- New functions for AI content preview and confirmation ---

  // When user clicks "Add" on the AI preview popup, show the replacement alert.
  const handleAIPreviewAdd = () => {
    setShowAIPreview(false);
    setShowAIReplaceAlert(true);
  };

  // When user confirms replacement of previous content.
  const confirmAIReplace = () => {
    setAbout(aiResult);
    setShowAIReplaceAlert(false);
  };

  // When user cancels the replacement alert.
  const cancelAIReplace = () => {
    setShowAIReplaceAlert(false);
  };

  // For AI Preview modal cancel, hide the AI Preview Modal and then show the cancel confirmation modal.
  const handleAIPreviewCancelClick = () => {
    setShowAIPreview(false);
    setShowAICancelConfirm(true);
  };

  // When user confirms AI cancel (i.e. discards the generated content).
  const confirmAICancel = () => {
    setShowAICancelConfirm(false);
  };

  // When user cancels the AI cancel confirmation, re-show the AI Preview Modal.
  const cancelAICancel = () => {
    setShowAICancelConfirm(false);
    setShowAIPreview(true);
  };

  // Final (read-only) mode view.
  if (finalMode) {
    return (
      <div className="mb-6 group relative">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">
          Professional Profile
        </h3>
        <p className="text-gray-700 text-justify leading-relaxed">
          {about || "Experienced professional with demonstrated expertise..."}
        </p>
      </div>
    );
  }

  return (
    <div
      className="relative group border-l-4 border-blue-500 bg-white shadow-lg rounded-lg p-8 mb-6 transition-transform duration-200 hover:scale-105"
      draggable={!isEditing}
      onDragStart={!isEditing ? handleDragStart : undefined}
    >
      {/* Loader overlay when auto-fill is in progress (when not editing) */}
      {!isEditing && isGenerating && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">
          <Loader size="lg" />
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <FiUser className="w-7 h-7 text-blue-500" />
          <h3 className="text-2xl font-semibold text-gray-800">About Me</h3>
        </div>
        <div className="flex gap-2">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <FiEdit2 className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="relative">
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 bg-white resize-none"
            rows="4"
            placeholder="Describe your professional experience, skills, and achievements..."
          />
          {/* Sample and AI Enhance buttons */}
          <div className="flex gap-3 mt-3">
            <button
              type="button"
              onClick={() => setShowSampleConfirm(true)}
              className="flex items-center gap-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md shadow-sm hover:bg-gray-300 transition-colors text-sm"
            >
              <FaMagic className="w-5 h-5" />
              <span>Sample</span>
            </button>
            <button
              type="button"
              onClick={generateAIContent}
              disabled={isGenerating}
              className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 transition-colors text-sm disabled:opacity-50"
            >
              {isGenerating ? (
                <Loader size="sm" />
              ) : (
                <>
                  <AiFillThunderbolt className="w-5 h-5" />
                  <span>AI Enhance</span>
                </>
              )}
            </button>
          </div>
          {/* Error message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded shadow">
              {error}
            </div>
          )}
          <button
            onClick={handleSave}
            className="mt-3 px-6 py-3 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      ) : (
        // Preview view (click anywhere to edit)
        <div
          className="prose max-w-none cursor-text"
          onClick={() => setIsEditing(true)}
        >
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {about ||
              "Click the edit button to add your professional summary..."}
          </p>
          <div className="mt-2 text-sm text-gray-400">
            Click to edit – Drag to auto-fill sample data
          </div>
        </div>
      )}

      {/* --- Global Modals Rendered via Portals --- */}

      {/* Confirmation modal for auto-fill sample data (drag-to-auto-fill) */}
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

      {/* Replacement confirmation alert for AI content */}
      <ConfirmationModal
        isOpen={showAIReplaceAlert}
        message="This will replace all previous content. Do you want to proceed?"
        onConfirm={confirmAIReplace}
        onCancel={cancelAIReplace}
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

AboutSection.propTypes = {
  sectionId: PropTypes.number.isRequired,
  finalMode: PropTypes.bool,
};

export default AboutSection;
