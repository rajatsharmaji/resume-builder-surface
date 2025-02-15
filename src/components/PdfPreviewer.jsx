import PropTypes from "prop-types";
import { useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { fullScreenPlugin } from "@react-pdf-viewer/full-screen";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/full-screen/lib/styles/index.css";

const PdfPreviewer = ({
  pdfDataUrl,
  setPdfDataUrl,
  isEditing,
  onCancelEdit,
}) => {
  const [pdfText, setPdfText] = useState("");
  const fullScreenPluginInstance = fullScreenPlugin();
  const { EnterFullScreen } = fullScreenPluginInstance;

  const handleSaveEdit = async () => {
    if (!pdfDataUrl) return;

    try {
      // Fetch the existing PDF bytes from the blob URL
      const existingPdfBytes = await fetch(pdfDataUrl).then((res) =>
        res.arrayBuffer()
      );
      // Load the PDFDocument from the existing bytes
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      // Embed a standard font (Helvetica) for rendering the text
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();
      const { height } = pages[0].getSize();

      // Draw the entered text on the first page
      pages[0].drawText(pdfText, {
        x: 50,
        y: height - 50,
        size: 16,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });

      // Save and update the modified PDF
      const modifiedPdfBytes = await pdfDoc.save();
      const modifiedPdfBlob = new Blob([modifiedPdfBytes], {
        type: "application/pdf",
      });
      const modifiedPdfUrl = URL.createObjectURL(modifiedPdfBlob);
      setPdfDataUrl(modifiedPdfUrl);

      // Reset the editor and close the overlay
      setPdfText("");
      onCancelEdit();
    } catch (error) {
      console.error("Error saving PDF edits:", error);
    }
  };

  return (
    <div className="relative w-full h-full bg-gray-50 border border-gray-200 rounded-lg shadow-sm flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-end p-2 bg-white border-b">
        <EnterFullScreen />
      </div>

      {/* PDF Viewer */}
      <div className="flex-grow overflow-auto">
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <Viewer fileUrl={pdfDataUrl} plugins={[fullScreenPluginInstance]} />
        </Worker>
      </div>

      {/* Editing Overlay (shown only when isEditing is true) */}
      {isEditing && (
        <div className="absolute inset-0 bg-white bg-opacity-95 z-10 flex flex-col p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h4 className="text-xl font-semibold">Edit PDF Content</h4>
            <button
              onClick={onCancelEdit}
              className="text-3xl leading-none text-gray-600 hover:text-gray-800"
              aria-label="Close Editor"
            >
              &times;
            </button>
          </div>
          <textarea
            value={pdfText}
            onChange={(e) => setPdfText(e.target.value)}
            placeholder="Enter text to overlay on the PDF..."
            className="flex-grow p-4 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />
          <div className="mt-4 flex justify-end gap-4">
            <button
              onClick={handleSaveEdit}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Save Changes
            </button>
            <button
              onClick={onCancelEdit}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

PdfPreviewer.propTypes = {
  pdfDataUrl: PropTypes.string.isRequired,
  setPdfDataUrl: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  onCancelEdit: PropTypes.func.isRequired,
};

export default PdfPreviewer;
