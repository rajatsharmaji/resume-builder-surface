import PropTypes from "prop-types";
import { useState } from "react";
import { FiRefreshCw } from "react-icons/fi";

const CustomizationPanel = ({ customizations, updateCustomizations }) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleReset = () => {
    updateCustomizations("font", "Roboto");
    updateCustomizations("fontSize", 16);
    updateCustomizations("primaryColor", "#3b82f6");
    updateCustomizations("secondaryColor", "#f8fafc");
    setIsConfirmOpen(false);
  };

  const currentFontSize =
    typeof customizations.fontSize === "string"
      ? parseInt(customizations.fontSize, 10)
      : customizations.fontSize;

  return (
    <div className="space-y-6">
      {/* Reset Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsConfirmOpen(true)}
          className="flex items-center text-sm font-medium text-red-600 hover:text-red-700 transition-colors focus:outline-none"
        >
          <FiRefreshCw className="mr-2 w-5 h-5" />
          Reset to Defaults
        </button>
      </div>

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl transform transition-all duration-300">
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Reset Customizations?
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              This will reset all styling to default values. This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors focus:outline-none"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customization Controls */}
      <div className="space-y-6">
        {/* Font Family */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Font Family
          </label>
          <select
            value={customizations.font}
            onChange={(e) => updateCustomizations("font", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="Roboto">Roboto</option>
            <option value="Open Sans">Open Sans</option>
            <option value="Lato">Lato</option>
            <option value="Inter">Inter</option>
          </select>
        </div>

        {/* Font Size */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">
              Font Size
            </label>
            <span className="text-sm text-gray-500">{currentFontSize}px</span>
          </div>
          <input
            type="range"
            min="12"
            max="20"
            step="1"
            value={currentFontSize}
            onChange={(e) =>
              updateCustomizations("fontSize", parseInt(e.target.value, 10))
            }
            className="w-full h-2 bg-gray-300 rounded-full appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Color Pickers */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Color
            </label>
            <input
              type="color"
              value={customizations.primaryColor}
              onChange={(e) =>
                updateCustomizations("primaryColor", e.target.value)
              }
              className="w-full h-10 p-0 border-0 rounded-md cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Color
            </label>
            <input
              type="color"
              value={customizations.secondaryColor}
              onChange={(e) =>
                updateCustomizations("secondaryColor", e.target.value)
              }
              className="w-full h-10 p-0 border-0 rounded-md cursor-pointer"
            />
          </div>
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
