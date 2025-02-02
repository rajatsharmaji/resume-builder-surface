import PropTypes from "prop-types";
import { FaListAlt, FaColumns, FaTh } from "react-icons/fa";

const TemplatePanel = ({ applyTemplate, customizations }) => {
  const templates = [
    {
      id: "single-column",
      name: "Single Column",
      icon: <FaListAlt className="w-8 h-8 text-blue-500" />,
      description: "Clean linear layout perfect for traditional resumes",
      color: "bg-blue-50 hover:bg-blue-100",
    },
    {
      id: "two-column",
      name: "Two Column",
      icon: <FaColumns className="w-8 h-8 text-green-500" />,
      description: "Modern split layout with sidebar section",
      color: "bg-green-50 hover:bg-green-100",
    },
    {
      id: "grid",
      name: "Grid Layout",
      icon: <FaTh className="w-8 h-8 text-purple-500" />,
      description: "Flexible grid system for creative presentations",
      color: "bg-purple-50 hover:bg-purple-100",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => applyTemplate(template.id)}
            className={`cursor-pointer transition-transform transform hover:scale-105 duration-200 border-2 rounded-lg p-3 max-w-xs ${
              template.color
            } ${
              customizations.template === template.id
                ? "border-blue-500 shadow-md"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 p-2 bg-white rounded-md shadow">
                {template.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  {template.name}
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  {template.description}
                </p>
              </div>
            </div>
          </div>
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
