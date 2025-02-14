import { useState } from "react";
import PropTypes from "prop-types";
import { FiDownload, FiEdit } from "react-icons/fi";
import Loader from "./common/Loader";
import PdfPreviewer from "./PdfPreviewer";
import PdfEditor from "./PdfEditor";

const ResumeGenerator = ({ pdfDataUrl, isLoading, error, setPdfDataUrl }) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const handleDownload = () => {
    if (!pdfDataUrl) return;
    const link = document.createElement("a");
    link.href = pdfDataUrl;
    link.download = "resume.pdf";
    link.click();
  };

  return (
    <div className={`p-0 bg-white rounded-lg shadow-md`}>
      <div className="mb-6">
        {isLoading && (
          <div className="flex items-center text-blue-600">
            <Loader size="md" className="mr-2" />
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
                <FiDownload className="w-4 h-4 text-purple-600 transition-transform duration-300" />
                <span className="tracking-normal">Download PDF</span>
              </span>
            </button>
            <button
              onClick={() => setIsEditMode(true)}
              className="relative inline-flex items-center justify-center overflow-hidden rounded border border-yellow-500 bg-transparent px-5 py-2 font-medium text-yellow-600 shadow-sm transition-all duration-300 hover:bg-yellow-50 hover:shadow-md hover:-translate-y-0.25 focus:outline-none focus:ring-2 focus:ring-yellow-100 focus:ring-offset-2 active:translate-y-0"
            >
              <span className="relative flex items-center gap-2 text-sm">
                <FiEdit className="w-4 h-4 text-yellow-600 transition-transform duration-300" />
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
  pdfDataUrl: PropTypes.string,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  setPdfDataUrl: PropTypes.func.isRequired,
  disableDownload: PropTypes.bool,
};

export default ResumeGenerator;
