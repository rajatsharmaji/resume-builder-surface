import PropTypes from "prop-types";
import { useState } from "react";

const CustomizationPanel = ({ customizations, updateCustomizations }) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Reset to default customization values (using string values for consistency)
  const handleReset = () => {
    updateCustomizations("font", "Roboto");
    updateCustomizations("fontSize", "16px");
    updateCustomizations("primaryColor", "#007BFF");
    updateCustomizations("secondaryColor", "#F8F9FA");
    setIsConfirmOpen(false); // Close the confirmation modal after resetting
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-md mx-auto">
      {/* Title and Reset Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Customize Resume</h2>
        <button
          onClick={() => setIsConfirmOpen(true)}
          className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          aria-label="Reset to defaults"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Reset to Defaults?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to reset all customizations to their default
              values? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customization Options */}
      <div className="space-y-6">
        {/* Font */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Font:
          </label>
          <select
            value={customizations.font}
            onChange={(e) => updateCustomizations("font", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="Roboto">Roboto</option>
            <option value="Open Sans">Open Sans</option>
            <option value="Lato">Lato</option>
          </select>
        </div>

        {/* Font Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Font Size:{" "}
            <span className="font-medium">
              {parseInt(customizations.fontSize, 10)}px
            </span>
          </label>
          <input
            type="range"
            min="12"
            max="32"
            step="1"
            value={parseInt(customizations.fontSize, 10)}
            onChange={(e) =>
              updateCustomizations("fontSize", `${e.target.value}px`)
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Primary Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Color:
          </label>
          <input
            type="color"
            value={customizations.primaryColor}
            onChange={(e) =>
              updateCustomizations("primaryColor", e.target.value)
            }
            className="w-full h-10 rounded-lg cursor-pointer border border-gray-300"
          />
        </div>

        {/* Secondary Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Secondary Color:
          </label>
          <input
            type="color"
            value={customizations.secondaryColor}
            onChange={(e) =>
              updateCustomizations("secondaryColor", e.target.value)
            }
            className="w-full h-10 rounded-lg cursor-pointer border border-gray-300"
          />
        </div>
      </div>
    </div>
  );
};

CustomizationPanel.propTypes = {
  customizations: PropTypes.object.isRequired,
  updateCustomizations: PropTypes.func.isRequired,
};

export default CustomizationPanel;
