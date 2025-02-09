import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { FiDownload, FiEdit, FiLoader } from "react-icons/fi";
import PdfPreviewer from "./PdfPreviewer";
import PdfEditor from "./PdfEditor";

const ResumeGenerator = ({ className, disableDownload }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pdfDataUrl, setPdfDataUrl] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [numPages, setNumPages] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const generateResume = async () => {
    if (disableDownload) return;
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

      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfDataUrl(pdfUrl);
    } catch (err) {
      console.error("Error generating resume:", err);
      setError("Failed to generate resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!disableDownload && !pdfDataUrl && !isLoading) {
      generateResume();
    }
  }, [disableDownload, pdfDataUrl, isLoading, generateResume]);

  const handleDownload = () => {
    if (!pdfDataUrl) return;
    const link = document.createElement("a");
    link.href = pdfDataUrl;
    link.download = "resume.pdf";
    link.click();
  };

  return (
    <div className={`p-6 bg-gray-100 rounded-lg shadow-md ${className}`}>
      <div className="mb-4">
        <h3 className="text-2xl font-bold mb-2">Final Resume Preview</h3>
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
          <PdfPreviewer
            pdfDataUrl={pdfDataUrl}
            numPages={numPages}
            setNumPages={setNumPages}
          />

          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleDownload}
              className="flex items-center px-5 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              <FiDownload className="mr-2" />
              Download PDF
            </button>
            <button
              onClick={() => setIsEditMode(true)}
              className="flex items-center px-5 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
            >
              <FiEdit className="mr-2" />
              Edit PDF
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

ResumeGenerator.defaultProps = {
  className: "",
  disableDownload: true,
};

export default ResumeGenerator;
