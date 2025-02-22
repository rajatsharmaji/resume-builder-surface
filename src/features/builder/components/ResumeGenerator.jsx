import { useState } from "react";
import PropTypes from "prop-types";
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
        <div className="h-[calc(100vh-200px)]">
          {isEditMode ? (
            <PdfEditor
              htmlData={htmlData}
              setHtmlData={setHtmlData}
              setPdfDataUrl={setPdfDataUrl} // Pass setPdfDataUrl for saving
              onCancel={() => setIsEditMode(false)}
            />
          ) : (
            <PdfPreviewer
              pdfDataUrl={pdfDataUrl}
              setPdfDataUrl={setPdfDataUrl}
              isEditing={false}
              onCancelEdit={() => {}}
              onEdit={() => setIsEditMode(true)}
            />
          )}
        </div>
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
