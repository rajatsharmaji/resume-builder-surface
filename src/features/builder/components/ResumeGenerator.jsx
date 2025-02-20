// ResumeGenerator.js
import { useState } from "react";
import PropTypes from "prop-types";
import { FiDownload, FiEdit } from "react-icons/fi";
import axios from "axios";
import Loader from "../../../shared/components/Loader";
import PdfPreviewer from "./PdfPreviewer";
import PdfEditor from "./PdfEditor";

const ResumeGenerator = ({
  pdfDataUrl,
  htmlData,
  isLoading,
  error,
  setPdfDataUrl,
  setHtmlData,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleDownload = () => {
    if (!pdfDataUrl) return;
    const link = document.createElement("a");
    link.href = pdfDataUrl;
    link.download = "resume.pdf";
    link.click();
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Make an Axios POST call sending the new HTML content.
      // Replace the URL below with your actual endpoint.
      const response = await axios.post(
        "http://localhost:3008/api/v1/resume/generate-pdf",
        {
          html: htmlData,
        }
      );
      const { pdf } = response.data;
      const pdfBuffer = Uint8Array.from(atob(pdf), (c) => c.charCodeAt(0));
      const pdfBlob = new Blob([pdfBuffer], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfDataUrl(pdfUrl);
      setIsEditMode(false);
    } catch (error) {
      console.error("Error saving PDF:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-0 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        {isLoading && (
          <div className="flex items-center text-blue-600">
            <Loader size="md" className="mr-2" />
            <span>Generating PDF…</span>
          </div>
        )}
        {error && <p className="text-red-500">{error}</p>}
      </div>

      {pdfDataUrl ? (
        <>
          <div className="h-[calc(100vh-200px)]">
            {isEditMode ? (
              <PdfEditor
                htmlData={htmlData}
                setHtmlData={setHtmlData}
                onCancel={() => setIsEditMode(false)}
              />
            ) : (
              <PdfPreviewer
                pdfDataUrl={pdfDataUrl}
                setPdfDataUrl={setPdfDataUrl}
                isEditing={false}
                onCancelEdit={() => {}}
              />
            )}
          </div>

          <div className="mt-6 flex gap-4">
            {isEditMode ? (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="relative inline-flex items-center justify-center overflow-hidden rounded border border-green-600 bg-transparent px-5 py-2 font-medium text-green-600 shadow-sm transition-all duration-300 hover:bg-green-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-100 focus:ring-offset-2"
              >
                <span className="relative flex items-center gap-2 text-sm">
                  {isSaving ? "Saving..." : "Save"}
                </span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleDownload}
                  className="relative inline-flex items-center justify-center overflow-hidden rounded border border-purple-600 bg-transparent px-5 py-2 font-medium text-purple-600 shadow-sm transition-all duration-300 hover:bg-purple-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-100 focus:ring-offset-2"
                >
                  <span className="relative flex items-center gap-2 text-sm">
                    <FiDownload className="w-4 h-4 text-purple-600" />
                    <span className="tracking-normal">Download PDF</span>
                  </span>
                </button>
                <button
                  onClick={() => setIsEditMode(true)}
                  className="relative inline-flex items-center justify-center overflow-hidden rounded border border-yellow-500 bg-transparent px-5 py-2 font-medium text-yellow-600 shadow-sm transition-all duration-300 hover:bg-yellow-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-100 focus:ring-offset-2"
                >
                  <span className="relative flex items-center gap-2 text-sm">
                    <FiEdit className="w-4 h-4 text-yellow-600" />
                    <span className="tracking-normal">Edit PDF</span>
                  </span>
                </button>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <svg
            className="w-12 h-12 text-blue-500 animate-pulse"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 2L3 14h7v8l7-12h-7z"
            ></path>
          </svg>
          <p className="mt-4 text-lg font-medium text-blue-600 animate-pulse">
            Generate the PDF first!
          </p>
        </div>
      )}
    </div>
  );
};

ResumeGenerator.propTypes = {
  pdfDataUrl: PropTypes.string,
  htmlData: PropTypes.string,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  setPdfDataUrl: PropTypes.func.isRequired,
  setHtmlData: PropTypes.func.isRequired,
};

export default ResumeGenerator;
