/* eslint-disable react/prop-types */

const ElementsPanel = ({ sectionTypes, addSection, handleDragStart }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-1/2">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700 px-4 pt-4">
        Elements
      </h2>
      <div className="grid grid-cols-2 gap-2 overflow-y-auto px-4 pb-4">
        {sectionTypes.map(({ id, label, icon, color }) => (
          <button
            key={id}
            draggable
            onDragStart={(e) => handleDragStart(e, id)}
            onClick={() => addSection(id)}
            className={`p-3 rounded-lg flex flex-col items-center gap-2 hover:scale-[1.02] transition-transform ${color} hover:${color.replace(
              "100",
              "200"
            )} text-gray-600`}
          >
            {icon}
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ElementsPanel;
