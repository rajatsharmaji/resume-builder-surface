/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FiDownload, FiLoader } from "react-icons/fi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const DownloadButton = ({ children, contentRef, className }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Replace unsupported color functions before capture
  const replaceModernCSS = (element) => {
    const styles = window.getComputedStyle(element);
    const colorProperties = ["color", "backgroundColor", "borderColor"];

    colorProperties.forEach((prop) => {
      if (styles[prop].includes("oklch")) {
        // Convert oklch to hex (simple example - use proper conversion in production)
        const hexColor = "#4f46e5"; // Replace with actual conversion logic
        element.style.setProperty(prop, hexColor);
      }
    });
  };

  const handleDownload = async () => {
    if (!contentRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      // Clone the node to avoid modifying the original DOM
      const clone = contentRef.current.cloneNode(true);

      // Process cloned elements
      clone.querySelectorAll("*").forEach((el) => replaceModernCSS(el));

      // Create temporary container
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "fixed";
      tempContainer.style.left = "-9999px";
      tempContainer.appendChild(clone);
      document.body.appendChild(tempContainer);

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        logging: true,
        allowTaint: true,
        onclone: (document) => {
          // Additional cloning logic if needed
        },
      });

      document.body.removeChild(tempContainer);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
      pdf.save("resume.pdf");
    } catch (err) {
      setError("Failed to generate PDF. Please check console for details.");
      console.error("PDF generation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleDownload}
        disabled={isLoading}
        className={`relative inline-flex items-center justify-center gap-2 px-6 py-3 font-medium text-white transition-all
          bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:to-blue-600 shadow-lg hover:shadow-blue-200
          disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
      >
        {isLoading ? (
          <FiLoader className="w-5 h-5 animate-spin" />
        ) : (
          <FiDownload className="w-5 h-5" />
        )}
        {children || ""}
      </button>

      {error && (
        <div className="absolute top-full mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};

export default DownloadButton;
