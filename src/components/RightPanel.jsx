import { useState } from "react";
import PropTypes from "prop-types";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import TemplatePanel from "./TemplatePanel";
import CustomizationPanel from "./CustomizationPanel";
import { motion, AnimatePresence } from "framer-motion";

const RightPanel = ({
  applyTemplate,
  customizations,
  updateCustomizations,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    templates: true,
    customizations: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="w-80 h-screen sticky top-0 bg-gray-50 border-l border-gray-200 shadow-md flex flex-col">
      <div className="flex-1 p-6 space-y-6">
        {/* Templates Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <button
            onClick={() => toggleSection("templates")}
            className="w-full px-5 py-4 flex justify-between items-center focus:outline-none hover:bg-gray-100 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-800">Templates</h3>
            {expandedSections.templates ? (
              <FiChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <FiChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>
          <AnimatePresence initial={false}>
            {expandedSections.templates && (
              <motion.div
                key="templates-panel"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="px-5 pb-5 overflow-y-auto"
                style={{ maxHeight: "300px" }}
              >
                <TemplatePanel
                  applyTemplate={applyTemplate}
                  customizations={customizations}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Customizations Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <button
            onClick={() => toggleSection("customizations")}
            className="w-full px-5 py-4 flex justify-between items-center focus:outline-none hover:bg-gray-100 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              Customization
            </h3>
            {expandedSections.customizations ? (
              <FiChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <FiChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>
          <AnimatePresence initial={false}>
            {expandedSections.customizations && (
              <motion.div
                key="customizations-panel"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="px-5 pb-5 overflow-y-auto"
                style={{ maxHeight: "300px" }}
              >
                <CustomizationPanel
                  customizations={customizations}
                  updateCustomizations={updateCustomizations}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
