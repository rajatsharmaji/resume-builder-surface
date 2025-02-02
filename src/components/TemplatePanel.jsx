import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { FaListAlt, FaColumns, FaTh } from "react-icons/fa";

const TemplatePanel = ({ applyTemplate, customizations }) => {
  const templates = [
    {
      id: "single-column",
      name: "Single Column",
      icon: <FaListAlt className="w-10 h-10 text-blue-500" />,
      description: "Clean linear layout perfect for traditional resumes",
      color: "bg-blue-50 hover:bg-blue-100",
    },
    {
      id: "two-column",
      name: "Two Column",
      icon: <FaColumns className="w-10 h-10 text-green-500" />,
      description: "Modern split layout with sidebar section",
      color: "bg-green-50 hover:bg-green-100",
    },
    {
      id: "grid",
      name: "Grid Layout",
      icon: <FaTh className="w-10 h-10 text-purple-500" />,
      description: "Flexible grid system for creative presentations",
      color: "bg-purple-50 hover:bg-purple-100",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {templates.map((template) => (
          <motion.div
            key={template.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => applyTemplate(template.id)}
            className={`cursor-pointer transition-all duration-200 border-2 rounded-xl p-5 ${
              template.color
            } ${
              customizations.template === template.id
                ? "border-blue-500 shadow-lg"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 p-3 bg-white rounded-lg shadow">
                {template.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {template.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

TemplatePanel.propTypes = {
  applyTemplate: PropTypes.func.isRequired,
  customizations: PropTypes.object.isRequired,
};

export default TemplatePanel;
