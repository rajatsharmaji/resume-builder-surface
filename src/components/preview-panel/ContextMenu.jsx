/* eslint-disable react/prop-types */

const ContextMenu = ({ x, y, closeMenu, onAddSection, onRemoveSection }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: x,
        backgroundColor: "white",
        border: "1px solid #ccc",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
      }}
    >
      {/* Add Section Button */}
      <button
        onClick={() => {
          onAddSection(); // Trigger the "Add Section" logic
          closeMenu(); // Close the menu after clicking
        }}
        className="block w-full text-left py-2 px-4 hover:bg-gray-100"
      >
        Add Section
      </button>

      {/* Remove Section Button */}
      <button
        onClick={() => {
          onRemoveSection(); // Trigger the "Remove Section" logic
          closeMenu(); // Close the menu after clicking
        }}
        className="block w-full text-left py-2 px-4 hover:bg-gray-100 text-red-500"
      >
        Remove Section
      </button>
    </div>
  );
};

export default ContextMenu;
