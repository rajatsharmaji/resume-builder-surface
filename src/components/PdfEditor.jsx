// PdfEditor.js
import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const PdfEditor = ({ htmlData, setHtmlData, onCancel }) => {
  const iframeRef = useRef(null);
  const isInitialized = useRef(false); // to ensure we only set the initial content once

  // Only update iframe srcdoc on mount (or if unmounted/mounted again)
  useEffect(() => {
    if (!iframeRef.current || isInitialized.current) return;
    iframeRef.current.srcdoc = htmlData;
    isInitialized.current = true;
  }, [htmlData]);

  const handleLoad = () => {
    const iframe = iframeRef.current;
    const doc = iframe.contentDocument;
    const body = doc.body;

    // Make body content editable and focus it
    body.contentEditable = true;
    body.focus();

    // Handle input events to update parent's htmlData without reloading the iframe
    const handleInput = () => {
      const newBodyHTML = body.innerHTML;
      const parser = new DOMParser();
      const newDoc = parser.parseFromString(htmlData, "text/html");

      // Preserve the head content and update body content
      newDoc.body.innerHTML = newBodyHTML;

      // Serialize back to an HTML string
      const serializer = new XMLSerializer();
      const newHtml = serializer.serializeToString(newDoc);

      setHtmlData(newHtml);
    };

    body.addEventListener("input", handleInput);
    return () => body.removeEventListener("input", handleInput);
  };

  return (
    <div style={styles.editorContainer}>
      <div style={styles.toolbar}>
        <div style={styles.toolbarLeft}>
          <button onClick={onCancel} style={styles.button}>
            ← Back to Preview
          </button>
        </div>
        <div style={styles.toolbarRight}>
          <span style={styles.title}>Advanced Document Editor</span>
        </div>
      </div>
      <div style={styles.editorWrapper}>
        <iframe
          ref={iframeRef}
          onLoad={handleLoad}
          style={styles.iframe}
          title="pdf-editor"
        />
      </div>
    </div>
  );
};

const styles = {
  editorWrapper: {
    flex: 1,
    backgroundColor: "#f7fafc",
    overflow: "auto",
    position: "relative",
  },
  iframe: {
    width: "100%",
    height: "100%",
    border: "none",
    minHeight: "60vh", // decreased size
  },
  editorContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    minHeight: "60vh", // decreased size
    display: "flex",
    flexDirection: "column",
  },
  toolbar: {
    backgroundColor: "#2d3748",
    padding: "12px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e2e8f0",
  },
  toolbarLeft: {
    flex: 1,
  },
  toolbarRight: {
    flex: 1,
    textAlign: "right",
  },
  title: {
    color: "#ffffff",
    fontSize: "18px",
    fontWeight: "600",
    letterSpacing: "0.5px",
  },
  button: {
    padding: "8px 16px",
    backgroundColor: "#4a5568",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    color: "#ffffff",
    transition: "all 0.2s ease",
    fontWeight: "500",
  },
  // This style is for the contentEditable area within the iframe
  contentEditable: {
    width: "100%",
    height: "100%",
    outline: "none",
    fontFamily: "Arial, sans-serif",
    fontSize: "14px",
    lineHeight: "1.5",
    color: "#000",
  },
};

PdfEditor.propTypes = {
  htmlData: PropTypes.string.isRequired,
  setHtmlData: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default PdfEditor;
