import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ResumeContext } from "../context/resume-context";

const ResumeProvider = ({ children }) => {
  const initialSections = JSON.parse(
    localStorage.getItem("resumeSections")
  ) || [
    { id: Date.now() + 1, type: "header" },
    { id: Date.now() + 2, type: "about" },
    { id: Date.now() + 3, type: "experience" },
    { id: Date.now() + 4, type: "education" },
    { id: Date.now() + 5, type: "skills" },
    { id: Date.now() + 6, type: "projects" },
    { id: Date.now() + 7, type: "certifications" },
  ];

  const initialSectionsData =
    JSON.parse(localStorage.getItem("resumeSectionsData")) || {};

  const [sections, setSections] = useState(initialSections);
  const [sectionsData, setSectionsData] = useState(initialSectionsData);

  useEffect(() => {
    localStorage.setItem("resumeSections", JSON.stringify(sections));
    localStorage.setItem("resumeSectionsData", JSON.stringify(sectionsData));
  }, [sections, sectionsData]);

  const addSection = (type, insertIndex) => {
    const newSection = { id: Date.now(), type };
    setSections((prev) => {
      if (typeof insertIndex === "number") {
        const newSections = [...prev];
        newSections.splice(insertIndex, 0, newSection);
        return newSections;
      }
      return [...prev, newSection];
    });
    setSectionsData((prev) => ({
      ...prev,
      [newSection.id]: { type, content: {} },
    }));
  };

  const moveSection = (draggedId, targetIndex) => {
    setSections((prev) => {
      const draggedIndex = prev.findIndex((s) => s.id === draggedId);
      if (draggedIndex === -1 || draggedIndex === targetIndex) return prev;

      const newSections = [...prev];
      const [movedSection] = newSections.splice(draggedIndex, 1);
      newSections.splice(targetIndex, 0, movedSection);
      return newSections;
    });
  };

  const removeSection = (id) => {
    setSections((prev) => prev.filter((section) => section.id !== id));
    setSectionsData((prev) => {
      const newData = { ...prev };
      delete newData[id];
      return newData;
    });
  };

  const updateSectionContent = (id, content) => {
    setSectionsData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        content: { ...prev[id]?.content, ...content },
      },
    }));
  };

  const value = {
    sections,
    sectionsData,
    addSection,
    moveSection,
    removeSection,
    updateSectionContent,
  };

  return (
    <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
  );
};

ResumeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ResumeProvider;
