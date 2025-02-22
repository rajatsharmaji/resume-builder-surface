/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import {
  FiZoomIn,
  FiZoomOut,
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
  FiMaximize,
  FiSave,
  FiX,
  FiEdit,
} from "react-icons/fi";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css";
import "@react-pdf-viewer/page-navigation/lib/styles/index.css";

const PdfPreviewer = ({
  pdfDataUrl,
  setPdfDataUrl,
  isEditing,
  onCancelEdit,
  onEdit,
  initialScale,
  height,
}) => {
  const [pdfText, setPdfText] = useState("");
  const [textX, setTextX] = useState(50);
  const [textY, setTextY] = useState(50);
  const viewerRef = useRef(null);
  const containerRef = useRef(null);

  // Plugins
  const zoomPluginInstance = zoomPlugin();
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const { ZoomIn, ZoomOut, CurrentScale } = zoomPluginInstance;
  const { GoToPreviousPage, GoToNextPage, CurrentPageLabel } =
    pageNavigationPluginInstance;

  const handleFullScreen = () => {
    const container = containerRef.current;
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch((err) => {
        console.error("Error entering fullscreen:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleSaveEdit = async () => {
    if (!pdfDataUrl) return;

    try {
      const existingPdfBytes = await fetch(pdfDataUrl).then((res) =>
        res.arrayBuffer()
      );
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();
      const { height: pageHeight } = pages[0].getSize();

      pages[0].drawText(pdfText, {
        x: textX,
        y: pageHeight - textY,
        size: 16,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });

      const modifiedPdfBytes = await pdfDoc.save();
      const modifiedPdfBlob = new Blob([modifiedPdfBytes], {
        type: "application/pdf",
      });
      const modifiedPdfUrl = URL.createObjectURL(modifiedPdfBlob);
      setPdfDataUrl(modifiedPdfUrl);

      setPdfText("");
      setTextX(50);
      setTextY(50);
      onCancelEdit();
    } catch (error) {
      console.error("Error saving PDF edits:", error);
    }
  };

  const handleDownload = () => {
    if (!pdfDataUrl) return;
    const link = document.createElement("a");
    link.href = pdfDataUrl;
    link.download = "resume.pdf";
    link.click();
  };

  return (
    <div ref={containerRef} style={{ ...styles.container, height }}>
      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.toolGroup}>
          <ZoomOut>
            {(props) => (
              <button
                style={styles.button}
                onClick={props.onClick}
                title="Zoom Out"
              >
                <FiZoomOut style={styles.icon} />
              </button>
            )}
          </ZoomOut>
          <CurrentScale>
            {(props) => (
              <span style={styles.scaleText}>
                {Math.round(props.scale * 100)}%
              </span>
            )}
          </CurrentScale>
          <ZoomIn>
            {(props) => (
              <button
                style={styles.button}
                onClick={props.onClick}
                title="Zoom In"
              >
                <FiZoomIn style={styles.icon} />
              </button>
            )}
          </ZoomIn>
        </div>
        <div style={styles.toolGroup}>
          <GoToPreviousPage>
            {(props) => (
              <button
                style={styles.button}
                onClick={props.onClick}
                disabled={props.isDisabled}
                title="Previous Page"
              >
                <FiChevronLeft style={styles.icon} />
              </button>
            )}
          </GoToPreviousPage>
          <CurrentPageLabel>
            {(props) => (
              <span style={styles.pageText}>
                {props.currentPage + 1} / {props.numberOfPages}
              </span>
            )}
          </CurrentPageLabel>
          <GoToNextPage>
            {(props) => (
              <button
                style={styles.button}
                onClick={props.onClick}
                disabled={props.isDisabled}
                title="Next Page"
              >
                <FiChevronRight style={styles.icon} />
              </button>
            )}
          </GoToNextPage>
        </div>
        <div style={styles.toolGroup}>
          <button
            style={styles.button}
            onClick={handleFullScreen}
            title="Full Screen"
          >
            <FiMaximize style={styles.icon} />
          </button>
          <button
            style={styles.button}
            onClick={handleDownload}
            title="Download PDF"
          >
            <FiDownload style={styles.icon} />
          </button>
          <button style={styles.button} onClick={onEdit} title="Edit PDF">
            <FiEdit style={styles.icon} />
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div style={styles.viewerWrapper}>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <Viewer
            fileUrl={pdfDataUrl}
            plugins={[zoomPluginInstance, pageNavigationPluginInstance]}
            defaultScale={initialScale}
            ref={viewerRef}
          />
        </Worker>
      </div>

      {/* Editing Overlay */}
      {isEditing && (
        <div style={styles.overlay}>
          <div style={styles.overlayHeader}>
            <h4 style={styles.overlayTitle}>Edit PDF Content</h4>
            <button onClick={onCancelEdit} style={styles.closeButton}>
              <FiX style={styles.iconLarge} />
            </button>
          </div>
          <textarea
            value={pdfText}
            onChange={(e) => setPdfText(e.target.value)}
            placeholder="Enter text to overlay on the PDF..."
            style={styles.textarea}
          />
          <div style={styles.positionControls}>
            <label style={styles.label}>
              X Position:
              <input
                type="number"
                value={textX}
                onChange={(e) => setTextX(Number(e.target.value))}
                min="0"
                style={styles.positionInput}
              />
            </label>
            <label style={styles.label}>
              Y Position:
              <input
                type="number"
                value={textY}
                onChange={(e) => setTextY(Number(e.target.value))}
                min="0"
                style={styles.positionInput}
              />
            </label>
          </div>
          <div style={styles.overlayFooter}>
            <button onClick={handleSaveEdit} style={styles.saveButton}>
              <FiSave style={styles.icon} /> Save Changes
            </button>
            <button onClick={onCancelEdit} style={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  toolbar: {
    backgroundColor: "#ffffff",
    padding: "8px 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e5e7eb",
    flexWrap: "wrap",
    gap: "10px",
  },
  toolGroup: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  viewerWrapper: {
    flex: 1,
    overflow: "auto",
    backgroundColor: "#fff",
  },
  button: {
    padding: "6px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#374151",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    ":hover": {
      backgroundColor: "#f3f4f6",
      borderColor: "#d1d5db",
    },
    ":disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  },
  scaleText: {
    fontSize: "13px",
    color: "#374151",
    fontWeight: "500",
    padding: "0 8px",
  },
  pageText: {
    fontSize: "13px",
    color: "#374151",
    fontWeight: "500",
    padding: "0 8px",
  },
  icon: {
    fontSize: "16px",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  overlayHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "8px",
  },
  overlayTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1f2937",
  },
  closeButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    color: "#6b7280",
    transition: "color 0.2s ease",
    ":hover": {
      color: "#374151",
    },
  },
  iconLarge: {
    fontSize: "24px",
  },
  textarea: {
    flex: 1,
    padding: "12px",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    fontSize: "14px",
    color: "#374151",
    resize: "none",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    outline: "none",
    ":focus": {
      borderColor: "#3b82f6",
      boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.3)",
    },
  },
  positionControls: {
    display: "flex",
    gap: "16px",
    marginTop: "12px",
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    color: "#374151",
    fontWeight: "500",
  },
  positionInput: {
    width: "80px",
    padding: "6px",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    fontSize: "13px",
    color: "#374151",
    outline: "none",
    ":focus": {
      borderColor: "#3b82f6",
      boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.3)",
    },
  },
  overlayFooter: {
    marginTop: "16px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
  },
  saveButton: {
    padding: "8px 16px",
    backgroundColor: "#3b82f6",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    ":hover": {
      backgroundColor: "#2563eb",
    },
  },
  cancelButton: {
    padding: "8px 16px",
    backgroundColor: "#e5e7eb",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#374151",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: "#d1d5db",
    },
  },
};

PdfPreviewer.propTypes = {
  pdfDataUrl: PropTypes.string.isRequired,
  setPdfDataUrl: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  onCancelEdit: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  initialScale: PropTypes.number,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

PdfPreviewer.defaultProps = {
  initialScale: 1.3, // Default zoom set to 130%
  height: "90vh", // Increased default height
};

export default PdfPreviewer;
