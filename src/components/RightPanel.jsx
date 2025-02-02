import PropTypes from "prop-types";
import TemplatePanel from "./TemplatePanel";
import CustomizationPanel from "./CustomizationPanel";

const RightPanel = ({
  applyTemplate,
  customizations,
  updateCustomizations,
}) => {
  return (
    <div className="w-1/4 p-4 bg-gray-100 border-l border-gray-300">
      {/* Template Panel */}
      <TemplatePanel
        applyTemplate={applyTemplate}
        customizations={customizations}
      />
      {/* Customization Panel */}
      <CustomizationPanel
        customizations={customizations}
        updateCustomizations={updateCustomizations}
      />
    </div>
  );
};

// Prop Types Validation
RightPanel.propTypes = {
  applyTemplate: PropTypes.func.isRequired,
  customizations: PropTypes.object.isRequired,
  updateCustomizations: PropTypes.func.isRequired,
};

export default RightPanel;
