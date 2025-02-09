import { useState } from "react";
import PropTypes from "prop-types";
import { PDFDocument, rgb } from "pdf-lib";

const PdfEditor = ({ pdfDataUrl, setPdfDataUrl, onCancel }) => {
  const [pdfText, setPdfText] = useState("");

  const handleSaveEdit = async () => {
    if (!pdfDataUrl) return;

    try {
      const existingPdfBytes = await fetch(pdfDataUrl).then((res) =>
        res.arrayBuffer()
      );
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const { height } = pages[0].getSize();

      pages[0].drawText(pdfText, {
        x: 50,
        y: height - 50,
        size: 16,
        color: rgb(0, 0, 0),
      });

      const modifiedPdfBytes = await pdfDoc.save();
      const modifiedPdfBlob = new Blob([modifiedPdfBytes], {
        type: "application/pdf",
      });
      const modifiedPdfUrl = URL.createObjectURL(modifiedPdfBlob);
      setPdfDataUrl(modifiedPdfUrl);
      onCancel();
    } catch (error) {
      console.error("Error saving PDF edits:", error);
    }
  };

  return (
    <div className="mt-6 p-4 bg-white rounded border">
      <h4 className="text-lg font-semibold mb-2">Edit PDF Text</h4>
      <textarea
        value={pdfText}
        onChange={(e) => setPdfText(e.target.value)}
        className="w-full h-32 p-2 border border-gray-300 rounded resize-none"
      />
      <div className="mt-4 flex gap-3">
        <button
          onClick={handleSaveEdit}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Save Changes
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

PdfEditor.propTypes = {
  pdfDataUrl: PropTypes.string.isRequired,
  setPdfDataUrl: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default PdfEditor;
