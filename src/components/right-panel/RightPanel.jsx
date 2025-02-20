import PropTypes from "prop-types";
import TemplatePanel from "./TemplatePanel";

const RightPanel = ({ applyTemplate, customizations, mobile }) => {
  return (
    <div
      className={`${
        mobile
          ? ""
          : "hidden md:flex md:flex-col w-full md:w-48 h-full md:h-screen sticky top-0 bg-white border-l border-gray-100"
      }`}
    >
      <div className="p-3 pb-2 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Templates</h3>
        <p className="text-xs text-gray-500">
          Choose from professional layouts
        </p>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-3">
        <TemplatePanel
          applyTemplate={applyTemplate}
          customizations={customizations}
        />
      </div>
    </div>
  );
};

RightPanel.propTypes = {
  applyTemplate: PropTypes.func.isRequired,
  customizations: PropTypes.object.isRequired,
  mobile: PropTypes.bool,
};

export default RightPanel;
