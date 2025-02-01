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

  return (
    <ResumeContext.Provider
      value={{
        sections,
        sectionsData,
        addSection,
        updateSectionContent,
        removeSection,
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
