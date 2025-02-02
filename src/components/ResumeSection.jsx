import { useState } from "react";
import PropTypes from "prop-types";

const ResumeSection = ({ finalMode = false }) => {
  const [resumeFile, setResumeFile] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file.name);
    }
  };

  // In final mode, show a non-editable preview of the uploaded file
  if (finalMode) {
    return (
      <div className="border p-4 my-2">
        <label className="block font-medium mb-2">Uploaded Resume</label>
        {resumeFile ? (
          <div className="mt-2 text-sm text-gray-600">
            File: <strong>{resumeFile}</strong>
          </div>
        ) : (
          <div className="mt-2 text-sm text-gray-600">
            No resume file uploaded.
          </div>
        )}
      </div>
    );
  }

  // Editable version with file input
  return (
    <div className="border p-4 my-2">
      <label className="block font-medium mb-2">Upload Resume</label>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        onChange={handleFileUpload}
      />
      {resumeFile && (
        <div className="mt-2 text-sm text-gray-600">
          Uploaded File: <strong>{resumeFile}</strong>
        </div>
      )}
    </div>
  );
};

ResumeSection.propTypes = {
  finalMode: PropTypes.bool,
};

export default ResumeSection;
