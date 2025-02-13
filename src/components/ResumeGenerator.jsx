import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { FiDownload, FiEdit, FiLoader } from "react-icons/fi";
import PdfPreviewer from "./PdfPreviewer";
import PdfEditor from "./PdfEditor";

const ResumeGenerator = ({ className = "", disableDownload = true }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pdfDataUrl, setPdfDataUrl] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (!disableDownload && !pdfDataUrl && !isLoading) {
      const generateResume = async () => {
        setIsLoading(true);
        setError(null);

        try {
          const response = await axios.post(
            "http://localhost:3008/api/v1/resume/generate",
            {
              firstName: "John",
              lastName: "Doe",
              email: "john.doe@example.com",
              phone: "123-456-7890",
              website: "https://johndoe.com",
              education: [
                {
                  institution: "University of Example",
                  degree: "Bachelor of Science in Computer Science",
                  graduationDate: "May 2020",
                  location: "City, Country",
                  gpa: "3.8/4.0",
                },
              ],
              experience: [
                {
                  company: "Tech Corp",
                  position: "Software Engineer",
                  startDate: "Jan 2021",
                  endDate: "Present",
                  location: "Remote",
                  details: [
                    "Developed scalable web applications using React and Node.js.",
                    "Optimized database queries, reducing load times by 30%.",
                  ],
                },
              ],
            },
            { responseType: "arraybuffer" }
          );

          const pdfBlob = new Blob([response.data], {
            type: "application/pdf",
          });
          const pdfUrl = URL.createObjectURL(pdfBlob);
          setPdfDataUrl(pdfUrl);
        } catch (err) {
          console.error("Error generating resume:", err);
          setError("Failed to generate resume. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };

      generateResume();
    }
  }, [disableDownload, pdfDataUrl, isLoading]);

  const handleDownload = () => {
    if (!pdfDataUrl) return;

    const link = document.createElement("a");
    link.href = pdfDataUrl;
    link.download = "resume.pdf";
    link.click();
  };

  return (
    <div className={`p-0 bg-white rounded-lg shadow-md ${className}`}>
      <div className="mb-6">
        {isLoading && (
          <div className="flex items-center text-blue-600">
            <FiLoader className="animate-spin mr-2" />
            <span>Generating PDF…</span>
          </div>
        )}
        {error && <p className="text-red-500">{error}</p>}
      </div>

      {pdfDataUrl && (
        <>
          <div className="h-[calc(100vh-200px)]">
            <PdfPreviewer pdfDataUrl={pdfDataUrl} />
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={handleDownload}
              className="relative inline-flex items-center justify-center overflow-hidden rounded border border-purple-600 bg-transparent px-5 py-2 font-medium text-purple-600 shadow-sm transition-all duration-300 hover:bg-purple-50 hover:shadow-md hover:-translate-y-0.25 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:ring-offset-2 active:translate-y-0"
            >
              <span className="relative flex items-center gap-2 text-sm">
                <FiDownload className="w-4 h-4 text-purple-600 transition-transform duration-300 group-hover:scale-110" />
                <span className="tracking-normal">Download PDF</span>
              </span>
            </button>
            <button
              onClick={() => setIsEditMode(true)}
              className="relative inline-flex items-center justify-center overflow-hidden rounded border border-yellow-500 bg-transparent px-5 py-2 font-medium text-yellow-600 shadow-sm transition-all duration-300 hover:bg-yellow-50 hover:shadow-md hover:-translate-y-0.25 focus:outline-none focus:ring-2 focus:ring-yellow-100 focus:ring-offset-2 active:translate-y-0"
            >
              <span className="relative flex items-center gap-2 text-sm">
                <FiEdit className="w-4 h-4 text-yellow-600 transition-transform duration-300 group-hover:scale-110" />
                <span className="tracking-normal">Edit PDF</span>
              </span>
            </button>
          </div>
        </>
      )}

      {isEditMode && (
        <PdfEditor
          pdfDataUrl={pdfDataUrl}
          setPdfDataUrl={setPdfDataUrl}
          onCancel={() => setIsEditMode(false)}
        />
      )}
    </div>
  );
};

ResumeGenerator.propTypes = {
  className: PropTypes.string,
  disableDownload: PropTypes.bool,
};

export default ResumeGenerator;
