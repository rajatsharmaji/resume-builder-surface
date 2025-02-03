// src/components/DownloadButton.jsx
import { useState } from "react";
import PropTypes from "prop-types";
import { FiDownload, FiLoader } from "react-icons/fi";
import { jsPDF } from "jspdf";
import * as htmlToImage from "html-to-image";

const DownloadButton = ({ contentRef, className, disableDownload }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [format, setFormat] = useState("pdf");

  // Helper to trigger a download of a data URL
  const downloadImage = (dataUrl, filename) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    link.click();
  };

  // Download as PNG using html-to-image with an increased pixel ratio for better quality
  const handleDownloadAsPNG = async () => {
    const dataUrl = await htmlToImage.toPng(contentRef.current, {
      quality: 1,
      pixelRatio: 3,
    });
    downloadImage(dataUrl, "resume.png");
  };

  // Download as JPEG using html-to-image with an increased pixel ratio for better quality
  const handleDownloadAsJPEG = async () => {
    const dataUrl = await htmlToImage.toJpeg(contentRef.current, {
      quality: 1,
      pixelRatio: 3,
    });
    downloadImage(dataUrl, "resume.jpeg");
  };

  // Download as PDF by capturing a high-resolution canvas and splitting it into pages with margins.
  const handleDownloadAsPDF = async () => {
    // Capture the resume content as a high-resolution canvas.
    const canvas = await htmlToImage.toCanvas(contentRef.current, {
      quality: 1,
      pixelRatio: 3,
    });

    // Create a new PDF document (portrait, points, A4)
    const pdf = new jsPDF("p", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth(); // total width in pt
    const pageHeight = pdf.internal.pageSize.getHeight(); // total height in pt

    // Define margins (in points) for each page.
    const margin = 20;
    const effectivePageWidth = pageWidth - margin * 2;
    const effectivePageHeight = pageHeight - margin * 2;

    // Determine the scale factor to map the canvas width to effective PDF width.
    const scale = effectivePageWidth / canvas.width;

    // Calculate the height of one slice in original canvas pixels.
    // This is the height (in canvas pixels) that fits in effectivePageHeight after scaling.
    const sliceHeightPx = effectivePageHeight / scale;

    // Calculate how many slices/pages we need.
    const totalPages = Math.ceil(canvas.height / sliceHeightPx);

    for (let i = 0; i < totalPages; i++) {
      // For each page, create a temporary canvas for the slice.
      const sourceY = i * sliceHeightPx;
      const sliceCanvas = document.createElement("canvas");
      sliceCanvas.width = canvas.width;
      // Ensure the last slice does not exceed the canvas height.
      sliceCanvas.height = Math.min(sliceHeightPx, canvas.height - sourceY);

      const ctx = sliceCanvas.getContext("2d");
      ctx.drawImage(
        canvas,
        0,
        sourceY,
        canvas.width,
        sliceCanvas.height, // source rectangle
        0,
        0,
        canvas.width,
        sliceCanvas.height // destination rectangle
      );

      const sliceDataUrl = sliceCanvas.toDataURL("image/png", 1);

      // Calculate the height in PDF (in points) for this slice.
      const slicePdfHeight = sliceCanvas.height * scale;

      // For the first page, we already have one page in the PDF.
      // For subsequent pages, add a new page.
      if (i > 0) pdf.addPage();

      // Draw the slice image with the defined margins.
      pdf.addImage(
        sliceDataUrl,
        "PNG",
        margin, // x position (left margin)
        margin, // y position (top margin)
        effectivePageWidth, // width in PDF
        slicePdfHeight // height in PDF
      );
    }

    pdf.save("resume.pdf");
  };

  // Main download handler that calls the proper function based on the selected format.
  const handleDownload = async () => {
    if (!contentRef.current) return;
    setIsLoading(true);
    setError(null);

    try {
      if (format === "pdf") {
        await handleDownloadAsPDF();
      } else if (format === "png") {
        await handleDownloadAsPNG();
      } else if (format === "jpeg") {
        await handleDownloadAsJPEG();
      }
    } catch (err) {
      console.error("Download error:", err);
      setError("Failed to generate download. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-4 mb-2">
        {/* Format selection */}
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="pdf">PDF</option>
          <option value="png">PNG</option>
          <option value="jpeg">JPEG</option>
        </select>
        <button
          onClick={handleDownload}
          disabled={isLoading || disableDownload}
          className={`inline-flex items-center gap-2 px-6 py-3 font-medium text-white rounded-lg transition-colors ${
            disableDownload
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } ${className}`}
        >
          {isLoading ? (
            <FiLoader className="animate-spin" />
          ) : (
            <FiDownload className="w-5 h-5" />
          )}
          Download Resume
        </button>
      </div>
      {disableDownload && (
        <p className="mt-2 text-sm text-gray-600">
          Switch to Final Preview to download the clean resume.
        </p>
      )}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

DownloadButton.propTypes = {
  contentRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    .isRequired,
  className: PropTypes.string,
  disableDownload: PropTypes.bool,
};

export default DownloadButton;
