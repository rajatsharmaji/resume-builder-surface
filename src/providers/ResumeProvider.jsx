/* eslint-disable react/prop-types */
// src/context/resume-context.js
import { useState, useEffect } from "react";
import { ResumeContext } from "../context/resume-context";

// Create the context

// Provider component
const ResumeProvider = ({ children }) => {
  // Retrieve data from localStorage or initialize with default values
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

  // State for sections and their content
  const [sections, setSections] = useState(initialSections);
  const [sectionsData, setSectionsData] = useState(initialSectionsData);

  // Save sections and sectionsData to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("resumeSections", JSON.stringify(sections));
    localStorage.setItem("resumeSectionsData", JSON.stringify(sectionsData));
  }, [sections, sectionsData]);

  // Add a new section
  const addSection = (type) => {
    const newSection = { id: Date.now(), type };
    setSections((prev) => [...prev, newSection]);
    setSectionsData((prev) => ({
      ...prev,
      [newSection.id]: { type, content: {} },
    }));
  };

  // Move a section to a new position
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

  // Remove a section
  const removeSection = (id) => {
    setSections((prev) => prev.filter((section) => section.id !== id));
    setSectionsData((prev) => {
      const newData = { ...prev };
      delete newData[id];
      return newData;
    });
  };

  // Update the content of a section
  const updateSectionContent = (id, content) => {
    setSectionsData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        content: { ...prev[id]?.content, ...content },
      },
    }));
  };

  // Provide the state and functions to the context
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
export default ResumeProvider;
