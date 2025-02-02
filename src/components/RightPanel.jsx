import PropTypes from "prop-types";
import TemplatePanel from "./TemplatePanel";
import CustomizationPanel from "./CustomizationPanel";

const RightPanel = ({
  applyTemplate,
  customizations,
  updateCustomizations,
}) => {
  return (
    <div className="w-80 h-screen sticky top-0 overflow-y-auto p-6 bg-white border-l border-gray-200 shadow-md">
      <div className="mb-6">
        <TemplatePanel
          applyTemplate={applyTemplate}
          customizations={customizations}
        />
      </div>
      <div>
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
