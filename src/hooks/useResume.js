// src/hooks/useResume.js
import { useContext } from "react";
import { ResumeContext } from "../context/resume-context";

const useResume = () => {
  // Retrieve the context value
  const context = useContext(ResumeContext);
  // Throw an error if the context is not provided
  if (!context) {
    throw new Error("useResume must be used within a ResumeContext.Provider");
  }

  // Return the context value
  return context;
};

export default useResume;
