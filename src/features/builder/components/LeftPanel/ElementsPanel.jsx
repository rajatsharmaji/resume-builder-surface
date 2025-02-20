import { useRef } from "react";
import PropTypes from "prop-types";

const ElementsPanel = ({ sectionTypes, addSection }) => {
  const draggingRef = useRef(false);

  const handleDragStart = (e, id) => {
    draggingRef.current = true;
    e.dataTransfer.setData("sectionId", id);
  };

  const handleDragEnd = () => {
    setTimeout(() => {
      draggingRef.current = false;
    }, 0);
  };

  const handleClick = (id) => {
    if (draggingRef.current) {
      draggingRef.current = false;
      return;
    }
    addSection(id);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
      <h2 className="text-lg font-semibold mb-4 text-gray-700 px-4 pt-4">
        Elements
      </h2>
      {/* Use grid layout to ensure a minimum of two columns */}
      <div className="grid grid-cols-2 gap-4 px-4 pb-4">
        {sectionTypes.map(({ id, label, icon, color }) => (
          <button
            key={id}
            draggable
            onDragStart={(e) => handleDragStart(e, id)}
            onDragEnd={handleDragEnd}
            onClick={() => handleClick(id)}
            className={`flex flex-col items-center justify-center gap-1 rounded-lg transition-transform hover:scale-105 ${color} text-gray-600 w-20 h-20`}
          >
            <div className="text-lg">{icon}</div>
            <span className="text-xs font-medium text-center p-1 truncate">
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

ElementsPanel.propTypes = {
  sectionTypes: PropTypes.array.isRequired,
  addSection: PropTypes.func.isRequired,
};

export default ElementsPanel;
