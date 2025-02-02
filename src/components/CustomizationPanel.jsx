import React from "react";
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
    <div className="mt-6">
      {/* Header */}
      <h2 className="text-lg font-semibold mb-4">Customize Resume</h2>

      {/* Customization Options */}
      <div className="space-y-4">
        {/* Font */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Font:
          </label>
          <select
            value={customizations.font}
            onChange={(e) => updateCustomizations("font", e.target.value)}
            className="w-full p-2 rounded border border-gray-300 mt-1"
          >
            <option>Roboto</option>
            <option>Open Sans</option>
            <option>Lato</option>
          </select>
        </div>

        {/* Font Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Font Size:
          </label>
          <input
            type="number"
            value={parseInt(customizations.fontSize, 10)}
            onChange={(e) =>
              updateCustomizations("fontSize", `${e.target.value}px`)
            }
            className="w-full p-2 rounded border border-gray-300 mt-1"
          />
        </div>

        {/* Primary Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Primary Color:
          </label>
          <input
            type="color"
            value={customizations.primaryColor}
            onChange={(e) =>
              updateCustomizations("primaryColor", e.target.value)
            }
            className="w-full p-2 rounded mt-1"
          />
        </div>

        {/* Secondary Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Secondary Color:
          </label>
          <input
            type="color"
            value={customizations.secondaryColor}
            onChange={(e) =>
              updateCustomizations("secondaryColor", e.target.value)
            }
            className="w-full p-2 rounded mt-1"
          />
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
};

// Prop Types Validation
CustomizationPanel.propTypes = {
  customizations: PropTypes.object.isRequired,
  updateCustomizations: PropTypes.func.isRequired,
};

export default CustomizationPanel;
