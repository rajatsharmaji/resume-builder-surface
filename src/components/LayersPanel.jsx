/* eslint-disable react/prop-types */
import SectionList from "./SectionList"; // adjust the path if needed

const LayersPanel = ({ sections, moveSection, removeSection }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-1/2">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700 px-4 pt-4">
        Layers
      </h2>
      <div className="overflow-y-auto flex-1 px-4 pb-4">
        <SectionList
          sections={sections}
          moveSection={moveSection}
          removeSection={removeSection}
        />
      </div>
    </div>
  );
};

export default LayersPanel;
