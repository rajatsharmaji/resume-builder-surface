import PropTypes from "prop-types";

const CustomizationPanel = ({ customizations, updateCustomizations }) => {
  // Reset to default customization values
  const handleReset = () => {
    updateCustomizations("font", "Roboto");
    updateCustomizations("fontSize", "16px");
    updateCustomizations("primaryColor", "#007BFF");
    updateCustomizations("secondaryColor", "#F8F9FA");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Customize Resume</h2>
      <div className="space-y-5">
        {/* Font */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Font:
          </label>
          <select
            value={customizations.font}
            onChange={(e) => updateCustomizations("font", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Roboto">Roboto</option>
            <option value="Open Sans">Open Sans</option>
            <option value="Lato">Lato</option>
          </select>
        </div>

        {/* Font Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Font Size:
          </label>
          <input
            type="number"
            value={parseInt(customizations.fontSize, 10)}
            onChange={(e) =>
              updateCustomizations("fontSize", `${e.target.value}px`)
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Primary Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Primary Color:
          </label>
          <input
            type="color"
            value={customizations.primaryColor}
            onChange={(e) =>
              updateCustomizations("primaryColor", e.target.value)
            }
            className="w-full p-1 rounded-md"
          />
        </div>

        {/* Secondary Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Secondary Color:
          </label>
          <input
            type="color"
            value={customizations.secondaryColor}
            onChange={(e) =>
              updateCustomizations("secondaryColor", e.target.value)
            }
            className="w-full p-1 rounded-md"
          />
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
};

CustomizationPanel.propTypes = {
  customizations: PropTypes.object.isRequired,
  updateCustomizations: PropTypes.func.isRequired,
};

export default CustomizationPanel;
