import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { ResumeContext } from "../context/resume-context";

const ResumeProvider = ({ children }) => {
  const [sections, setSections] = useState([]);
  const [sectionsData, setSectionsData] = useState({});

  const addSection = (type) => {
    const id = Date.now();
    setSections((prev) => [...prev, { id, type }]);
    setSectionsData((prev) => ({
      ...prev,
      [id]: { type, content: {} },
    }));
  };

  const updateSectionContent = useCallback((id, newContent) => {
    setSectionsData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        content: { ...prev[id].content, ...newContent },
      },
    }));
  }, []);

  const removeSection = (id) => {
    setSections((prev) => prev.filter((section) => section.id !== id));
    setSectionsData((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const moveSection = (draggedId, targetIndex) => {
    // Find the index of the dragged section
    const draggedIndex = sections.findIndex((s) => s.id === draggedId);

    // Create a new array to ensure immutability
    const updatedSections = [...sections];

    // Remove the dragged section from its current position
    const [draggedSection] = updatedSections.splice(draggedIndex, 1);

    // Insert the dragged section at the target position
    updatedSections.splice(targetIndex, 0, draggedSection);

    // Update the state with the new array
    setSections(updatedSections);
  };

  return (
    <ResumeContext.Provider
      value={{
        sections,
        sectionsData,
        addSection,
        updateSectionContent,
        removeSection,
        moveSection,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

ResumeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ResumeProvider;
