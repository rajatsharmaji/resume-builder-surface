/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  FiTrash2,
  FiLayout,
  FiUser,
  FiBriefcase,
  FiBook,
  FiCode,
  FiFileText,
  FiAward,
} from "react-icons/fi";

const sectionIcons = {
  header: <FiUser className="w-4 h-4" />,
  about: <FiFileText className="w-4 h-4" />,
  experience: <FiBriefcase className="w-4 h-4" />,
  education: <FiBook className="w-4 h-4" />,
  skills: <FiCode className="w-4 h-4" />,
  projects: <FiAward className="w-4 h-4" />,
  certifications: <FiAward className="w-4 h-4" />,
  footer: <FiLayout className="w-4 h-4" />,
};

// Custom confirmation modal component
const ConfirmDialog = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      {/* Modal */}
      <div className="bg-white rounded-lg p-6 z-50 max-w-sm mx-auto shadow-lg animate-fadeIn">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const SectionList = ({ sections, removeSection }) => {
  // State for the section ID that needs confirmation before deletion.
  const [confirmSectionId, setConfirmSectionId] = useState(null);

  const handleDelete = (sectionId) => {
    setConfirmSectionId(sectionId);
  };

  const confirmDelete = () => {
    if (confirmSectionId) {
      removeSection(confirmSectionId);
      setConfirmSectionId(null);
    }
  };

  const cancelDelete = () => {
    setConfirmSectionId(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6">
      <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-4">
        Content Layers
      </h3>

      <div className="space-y-2">
        {sections.map((section) => (
          <div
            key={section.id}
            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-blue-200 shadow-sm hover:bg-blue-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center p-2 bg-blue-100 rounded-full">
                {sectionIcons[section.type]}
              </div>
              <span className="text-sm font-medium text-gray-800">
                {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
              </span>
            </div>

            <div className="flex items-center">
              {section.type !== "header" && (
                <button
                  onClick={() => handleDelete(section.id)}
                  className="p-2 rounded-full text-red-500 hover:bg-red-100 transition-colors"
                  aria-label="Delete section"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}

        {sections.length === 0 && (
          <div className="text-center p-4 text-gray-400 text-sm">
            No sections added yet.
          </div>
        )}
      </div>

      {/* Custom Confirmation Modal */}
      {confirmSectionId && (
        <ConfirmDialog
          title="Confirm Removal"
          message="Are you sure you want to delete this section? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default SectionList;
