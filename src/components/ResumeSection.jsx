import { useState } from "react";

const ResumeSection = () => {
  const [resumeFile, setResumeFile] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file.name);
    }
  };

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

export default ResumeSection;
