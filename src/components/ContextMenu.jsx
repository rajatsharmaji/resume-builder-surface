import PropTypes from "prop-types";
import useResume from "../hooks/useResume";

const ContextMenu = ({ x, y, closeMenu }) => {
  const { addSection } = useResume();

  const handleAddSection = (type) => {
    addSection(type);
    closeMenu();
  };

  return (
    <div
      className="absolute bg-white shadow-lg border p-2 rounded z-50"
      style={{ top: y, left: x }}
    >
      <button
        onClick={() => handleAddSection("about")}
        className="block w-full text-left p-2"
      >
        Add About
      </button>
      {/* Add more buttons as needed */}
      <button
        onClick={() => handleAddSection("education")}
        className="block w-full text-left p-2"
      >
        Add Education
      </button>
      <button
        onClick={() => handleAddSection("experience")}
        className="block w-full text-left p-2"
      >
        Add Experience
      </button>
      <button
        onClick={() => handleAddSection("skills")}
        className="block w-full text-left p-2"
      >
        Add Skills
      </button>
      <button
        onClick={() => handleAddSection("projects")}
        className="block w-full text-left p-2"
      >
        Add Projects
      </button>
      <button
        onClick={() => handleAddSection("certifications")}
        className="block w-full text-left p-2"
      >
        Add Certifications
      </button>
    </div>
  );
};

ContextMenu.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  closeMenu: PropTypes.func.isRequired,
};

export default ContextMenu;
