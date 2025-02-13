import PropTypes from "prop-types";

const ContextMenu = ({ x, y, closeMenu, onAddSection, onRemoveSection }) => {
  return (
    <div
      style={{ top: y, left: x }}
      className="absolute bg-white border border-gray-200 shadow-md z-50 rounded-lg"
    >
      <button
        onClick={() => {
          onAddSection();
          closeMenu();
        }}
        className="block w-full text-left py-2 px-4 hover:bg-gray-100"
      >
        Add Section
      </button>
      <button
        onClick={() => {
          onRemoveSection();
          closeMenu();
        }}
        className="block w-full text-left py-2 px-4 hover:bg-gray-100 text-red-500"
      >
        Remove Section
      </button>
    </div>
  );
};

ContextMenu.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  closeMenu: PropTypes.func.isRequired,
  onAddSection: PropTypes.func,
  onRemoveSection: PropTypes.func,
};

export default ContextMenu;
