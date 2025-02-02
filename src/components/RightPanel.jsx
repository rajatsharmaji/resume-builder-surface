import PropTypes from "prop-types";
import TemplatePanel from "./TemplatePanel";
import CustomizationPanel from "./CustomizationPanel";

const RightPanel = ({
  applyTemplate,
  customizations,
  updateCustomizations,
}) => {
  return (
    <div className="w-80 h-screen sticky top-0 p-6 bg-white border-l border-gray-200 shadow-md flex flex-col space-y-6">
      {/* Template Panel */}
      <div className="max-h-[45vh] overflow-y-auto">
        <TemplatePanel
          applyTemplate={applyTemplate}
          customizations={customizations}
        />
      </div>
      {/* Customization Panel */}
      <div className="max-h-[45vh] overflow-y-auto">
        <CustomizationPanel
          customizations={customizations}
          updateCustomizations={updateCustomizations}
        />
      </div>
    </div>
  );
};

RightPanel.propTypes = {
  applyTemplate: PropTypes.func.isRequired,
  customizations: PropTypes.object.isRequired,
  updateCustomizations: PropTypes.func.isRequired,
};

export default RightPanel;
