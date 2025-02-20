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

const ConfirmDialog = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      {/* Modal */}
      <div className="bg-white rounded-lg p-4 z-50 max-w-xs mx-auto shadow-lg">
        <h3 className="text-base font-semibold mb-3 text-gray-800">{title}</h3>
        <p className="text-gray-700 mb-4 text-sm">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const SectionList = ({ sections, removeSection }) => {
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
    <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
        Content Layers
      </h3>
      <div className="flex flex-col gap-2">
        {sections.map((section) => (
          <div
            key={section.id}
            className="inline-flex items-center justify-between bg-gray-50 px-2 py-1 rounded-lg border border-blue-200 shadow-sm hover:bg-blue-50 transition-colors w-36 h-12 overflow-hidden"
          >
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center p-1 bg-blue-100 rounded-full">
                {sectionIcons[section.type]}
              </div>
              <span className="text-xs font-medium text-gray-800 truncate">
                {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
              </span>
            </div>
            <div className="flex items-center">
              {section.type !== "header" && (
                <button
                  onClick={() => handleDelete(section.id)}
                  className="p-1 rounded-full text-red-500 hover:bg-red-100 transition-colors"
                  aria-label="Delete section"
                >
                  <FiTrash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}

        {sections.length === 0 && (
          <div className="text-center p-3 text-gray-400 text-xs">
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
