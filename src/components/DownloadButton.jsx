import { useState } from "react";
import PropTypes from "prop-types";
import { FiDownload, FiLoader } from "react-icons/fi";
import jsPDF from "jspdf";
import { parse, formatHex } from "culori";
import domtoimage from "dom-to-image";

const DownloadButton = ({
  children,
  contentRef,
  className,
  disableDownload,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Convert oklch colors to HEX in CSS text
  const replaceOklchInText = (text) => {
    const oklchRegex = /oklch\(([^)]+)\)/g;
    return text.replace(oklchRegex, (match, args) => {
      try {
        const color = parse(`oklch(${args})`);
        if (!color) throw new Error("Invalid color format");
        return formatHex(color) || match;
      } catch (err) {
        console.warn("Error converting oklch color:", match, err);
        return "#4f46e5"; // Fallback color
      }
    });
  };

  // Process cloned content to replace oklch values
  const prepareClonedContent = (clone) => {
    // Handle inline styles
    clone.querySelectorAll("*").forEach((el) => {
      const style = el.getAttribute("style");
      if (style) {
        el.setAttribute("style", replaceOklchInText(style));
      }
    });

    // Handle internal style tags
    clone.querySelectorAll("style").forEach((styleEl) => {
      styleEl.textContent = replaceOklchInText(styleEl.textContent);
    });
  };

  const handleDownload = async () => {
    if (!contentRef.current) return;
    setIsLoading(true);
    setError(null);

    try {
      const clone = contentRef.current.cloneNode(true);
      prepareClonedContent(clone);

      // Create a temporary container for rendering
      const tempContainer = document.createElement("div");
      tempContainer.style.cssText = "position: fixed; left: -9999px;";
      tempContainer.appendChild(clone);
      document.body.appendChild(tempContainer);

      // Render the content to an image using dom-to-image
      const dataUrl = await domtoimage.toPng(clone);

      // Remove the temporary container
      document.body.removeChild(tempContainer);

      // Generate the PDF
      await generatePDF(dataUrl);
    } catch (err) {
      setError("Failed to generate PDF. Please try again.");
      console.error("PDF generation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = async (dataUrl) => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(dataUrl);
    const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

    let position = 0;
    while (position < imgHeight) {
      if (position > 0) pdf.addPage();
      const chunkHeight = Math.min(
        imgHeight - position,
        pdf.internal.pageSize.getHeight()
      );
      pdf.addImage(dataUrl, "PNG", 0, -position, pageWidth, imgHeight);
      position += chunkHeight;
    }

    pdf.save("resume.pdf");
  };

  return (
    <div className="relative">
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
        {children || "Download PDF"}
      </button>
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
  children: PropTypes.node,
  contentRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    .isRequired,
  className: PropTypes.string,
  disableDownload: PropTypes.bool,
};

export default DownloadButton;
