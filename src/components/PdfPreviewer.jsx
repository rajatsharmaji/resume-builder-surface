import PropTypes from "prop-types";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const PdfPreviewer = ({ pdfDataUrl }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  if (!pdfDataUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
        <svg
          className="w-12 h-12 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-gray-500">No PDF available for preview.</p>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-full bg-gray-50 border border-gray-200 rounded-lg shadow-sm overflow-hidden"
      style={{ height: "100%" }}
    >
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer
          fileUrl={pdfDataUrl}
          plugins={[defaultLayoutPluginInstance]}
          className="h-full w-full"
        />
      </Worker>
    </div>
  );
};

PdfPreviewer.propTypes = {
  pdfDataUrl: PropTypes.string,
};

export default PdfPreviewer;
