import PropTypes from "prop-types";
import SectionList from "../SectionList"; // adjust the path if needed

const LayersPanel = ({ sections, moveSection, removeSection }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-4 text-gray-700 px-4 pt-4">
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

LayersPanel.propTypes = {
  sections: PropTypes.array.isRequired,
  moveSection: PropTypes.func.isRequired,
  removeSection: PropTypes.func.isRequired,
};

export default LayersPanel;
