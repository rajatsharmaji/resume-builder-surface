/* eslint-disable react/prop-types */
// src/components/SectionList.jsx
import { useState } from "react";
import { FaTrash } from "react-icons/fa"; // Import trash icon from react-icons";

const SectionList = ({ sections, moveSection, removeSection }) => {
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDrop = (targetIndex) => {
    if (draggedIndex !== null) {
      moveSection(sections[draggedIndex].id, targetIndex);
      setDraggedIndex(null);
    }
  };

  const moveUp = (index) => {
    if (index > 0) {
      moveSection(sections[index].id, index - 1);
    }
  };

  const moveDown = (index) => {
    if (index < sections.length - 1) {
      moveSection(sections[index].id, index + 1);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-2">Layer Section</h3>
      <div className="bg-white shadow-md p-4 rounded">
        {sections.map((section, index) => (
          <div
            key={section.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDrop={() => handleDrop(index)}
            onDragOver={(e) => e.preventDefault()}
            className={`flex items-center justify-between p-2 border-b ${
              draggedIndex === index ? "bg-gray-200" : ""
            }`}
          >
            <span>
              {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
            </span>
            <div className="flex items-center space-x-2">
              {/* Move Up/Down Buttons */}
              <button
                onClick={() => moveUp(index)}
                className="px-2 py-1 bg-blue-500 text-white rounded mr-2"
              >
                ↑
              </button>
              <button
                onClick={() => moveDown(index)}
                className="px-2 py-1 bg-blue-500 text-white rounded"
              >
                ↓
              </button>
              {/* Delete Icon */}
              <button
                onClick={() => removeSection(section.id)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionList;
