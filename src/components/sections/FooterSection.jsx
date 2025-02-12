// src/components/FooterSection.jsx
import { useContext, useState } from "react";
import PropTypes from "prop-types";
import { FiFileText, FiZap, FiEdit2 } from "react-icons/fi"; // Added FiZap and FiEdit2 for actions
import { ResumeContext } from "../../context/resume-context";
import Loader from "../common/Loader";

const FooterSection = ({ sectionId, finalMode = false }) => {
  const { sectionsData, updateSectionContent } = useContext(ResumeContext);

  // Retrieve the initial footer note from the context.
  const initialNote = sectionsData[sectionId]?.content.note || "";
  const [note, setNote] = useState(initialNote);
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");

  // Update local state on each keystroke.
  const handleChange = (e) => {
    setNote(e.target.value);
  };

  // Save updates to the global context and exit editing mode.
  const handleSave = () => {
    updateSectionContent(sectionId, { note });
    setIsEditing(false);
  };

  // Simulated API call to generate AI-enhanced footer data.
  const generateAIContent = async () => {
    try {
      setIsGenerating(true);
      setError("");
      // Replace with your actual API endpoint.
      const response = await new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              data: {
                note: "This is an AI-generated footer note. For example, please contact us at info@example.com.",
              },
            }),
          1500
        )
      );
      setNote(response.data.note);
      updateSectionContent(sectionId, { note: response.data.note });
    } catch (err) {
      console.error(err);
      setError("Failed to generate AI footer data. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Simulated API call to fetch footer data when dragging the component.
  const fetchFooterData = async () => {
    try {
      setIsFetching(true);
      setError("");
      // Replace with your actual API endpoint.
      const response = await new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              data: {
                note: "This is auto-filled footer data. Visit our website for more information.",
              },
            }),
          1500
        )
      );
      setNote(response.data.note);
      updateSectionContent(sectionId, { note: response.data.note });
    } catch (err) {
      console.error(err);
      setError("Failed to fetch footer data. Please try again.");
    } finally {
      setIsFetching(false);
    }
  };

  // ----------------------
  // Final (Preview) Mode: Read-Only Display
  // ----------------------
  if (finalMode) {
    return (
      <div className="mt-8 py-6 bg-white rounded-lg shadow-sm border-t border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">
          Footer
        </h3>
        <p className="text-gray-700 text-center whitespace-pre-wrap">{note}</p>
      </div>
    );
  }

  // ----------------------
  // Editable Mode: Display with Action Buttons and Input Area
  // ----------------------
  return (
    <div
      className="relative group border-l-4 border-blue-500 bg-white rounded-lg shadow-sm py-6 mt-8 transition-all hover:bg-gray-50"
      draggable
      onDragStart={fetchFooterData} // Dragging triggers auto-fill.
    >
      {/* Header Row with Icon, Title, and Action Buttons */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <FiFileText className="w-6 h-6 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-800">Footer</h3>
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
        <div className="px-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Add a Note, Disclaimer, or Links
          </label>
          <textarea
            placeholder="Add a note, disclaimer, or links here..."
            value={note}
            onChange={handleChange}
            className="block w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          ></textarea>
          <button
            onClick={handleSave}
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      ) : (
        <div className="cursor-text" onClick={() => setIsEditing(true)}>
          <p className="text-center text-gray-700 whitespace-pre-wrap">
            {note || "Click to add a note"}
          </p>
          <div className="mt-2 text-center text-sm text-gray-400">
            Click to edit – Drag to auto-fill footer data available
          </div>
        </div>
      )}
    </div>
  );
};

FooterSection.propTypes = {
  sectionId: PropTypes.number.isRequired,
  finalMode: PropTypes.bool,
};

export default FooterSection;
