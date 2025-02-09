import PropTypes from "prop-types";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const PdfPreviewer = ({ pdfDataUrl }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  if (!pdfDataUrl) {
    return (
      <div className="p-4 border border-gray-300 rounded">
        <p>No PDF available for preview.</p>
      </div>
    );
  }

  return (
    <div
      className="mb-6 border border-gray-300 rounded"
      style={{ height: "750px", overflowY: "auto" }}
    >
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer fileUrl={pdfDataUrl} plugins={[defaultLayoutPluginInstance]} />
      </Worker>
    </div>
  );
};

PdfPreviewer.propTypes = {
  pdfDataUrl: PropTypes.string,
};

export default PdfPreviewer;
