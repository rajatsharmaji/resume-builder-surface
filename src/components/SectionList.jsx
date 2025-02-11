/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  FiTrash2,
  FiChevronUp,
  FiChevronDown,
  FiMove,
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

const SectionList = ({ sections, moveSection, removeSection }) => {
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = (index) => setDraggedIndex(index);
  const handleDrop = (targetIndex) => {
    if (draggedIndex !== null) {
      moveSection(sections[draggedIndex].id, targetIndex);
      setDraggedIndex(null);
    }
  };

  const moveUp = (index) =>
    index > 0 && moveSection(sections[index].id, index - 1);
  const moveDown = (index) =>
    index < sections.length - 1 && moveSection(sections[index].id, index + 1);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <h3 className="text-sm font-semibold mb-3 text-gray-600 flex items-center gap-2">
        <FiMove className="w-4 h-4" /> Content Layers
      </h3>

      <div className="space-y-1">
        {sections.map((section, index) => (
          <div
            key={section.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDrop={() => handleDrop(index)}
            onDragOver={(e) => e.preventDefault()}
            className={`group flex items-center justify-between p-2 rounded-lg border transition-all
              ${
                draggedIndex === index
                  ? "border-blue-200 bg-blue-50 shadow-sm"
                  : "border-transparent hover:border-gray-200 hover:bg-gray-50"
              }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-gray-400 opacity-60 group-hover:opacity-100 transition-opacity">
                <FiMove className="w-4 h-4" />
              </span>
              {sectionIcons[section.type]}
              <span className="text-sm font-medium text-gray-600">
                {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
              </span>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => moveUp(index)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-blue-600"
                aria-label="Move up"
              >
                <FiChevronUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => moveDown(index)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-blue-600"
                aria-label="Move down"
              >
                <FiChevronDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => removeSection(section.id)}
                className="p-1.5 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-600"
                aria-label="Delete section"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {sections.length === 0 && (
          <div className="text-center p-4 text-gray-400 text-sm">
            No sections added yet
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionList;
