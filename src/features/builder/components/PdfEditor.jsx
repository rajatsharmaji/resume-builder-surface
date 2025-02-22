import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
  FiArrowLeft,
  FiSave,
  FiBold,
  FiItalic,
  FiUnderline,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiRotateCcw,
  FiRotateCw,
  FiType,
} from "react-icons/fi";

const PdfEditor = ({ htmlData, setHtmlData, setPdfDataUrl, onCancel }) => {
  const iframeRef = useRef(null);
  const isInitialized = useRef(false);
  const [historyState, setHistoryState] = useState({
    history: [htmlData],
    index: 0,
  });
  const { history, index: historyIndex } = historyState;
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!iframeRef.current || isInitialized.current) return;
    iframeRef.current.srcdoc = htmlData;
    isInitialized.current = true;
  }, [htmlData]);

  const handleLoad = () => {
    const iframe = iframeRef.current;
    const doc = iframe.contentDocument;
    const body = doc.body;

    const style = doc.createElement("style");
    style.textContent = `
      body {
        padding: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        min-height: 100vh;
      }
      p { margin: 0 0 1em 0; }
    `;
    doc.head.appendChild(style);

    body.contentEditable = true;
    body.focus();

    const updateFormatStates = () => {
      setIsBold(doc.queryCommandState("bold"));
      setIsItalic(doc.queryCommandState("italic"));
      setIsUnderline(doc.queryCommandState("underline"));
    };

    const handleInput = () => {
      updateFormatStates();
      const newBodyHTML = body.innerHTML;
      const parser = new DOMParser();
      const newDoc = parser.parseFromString(htmlData, "text/html");
      newDoc.body.innerHTML = newBodyHTML;

      const serializer = new XMLSerializer();
      const newHtml = serializer.serializeToString(newDoc);

      setHtmlData(newHtml);
      setHistoryState((prevState) => {
        const trimmedHistory = prevState.history.slice(0, prevState.index + 1);
        const newHistory = [...trimmedHistory, newHtml];
        return { history: newHistory, index: newHistory.length - 1 };
      });
    };

    body.addEventListener("input", handleInput);
    doc.addEventListener("selectionchange", updateFormatStates);

    return () => {
      body.removeEventListener("input", handleInput);
      doc.removeEventListener("selectionchange", updateFormatStates);
    };
  };

  const execCommand = (command, value = null) => {
    iframeRef.current.contentDocument.execCommand(command, false, value);
    iframeRef.current.contentDocument.body.focus();
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryState((prev) => ({ ...prev, index: newIndex }));
      setHtmlData(history[newIndex]);
      iframeRef.current.srcdoc = history[newIndex];
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryState((prev) => ({ ...prev, index: newIndex }));
      setHtmlData(history[newIndex]);
      iframeRef.current.srcdoc = history[newIndex];
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await axios.post(
        "http://localhost:3008/api/v1/resume/generate-pdf",
        { html: htmlData },
        { responseType: "arraybuffer" }
      );
      const pdfBuffer = response.data;
      const pdfBlob = new Blob([pdfBuffer], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfDataUrl(pdfUrl);
      onCancel(); // Exit edit mode after saving
    } catch (error) {
      console.error("Error saving PDF:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={styles.editorContainer}>
      <div style={styles.toolbar}>
        <div style={styles.toolGroup}>
          <button
            onClick={onCancel}
            style={styles.button}
            title="Back to Preview"
          >
            <FiArrowLeft style={styles.icon} />
            <span style={styles.buttonText}>Preview</span>
          </button>
          <button
            onClick={handleSave}
            style={styles.buttonPrimary}
            disabled={isSaving}
            title="Save Document"
          >
            <FiSave style={styles.icon} />
            <span style={styles.buttonText}>
              {isSaving ? "Saving..." : "Save"}
            </span>
          </button>
        </div>
        <div style={styles.toolGroup}>
          <button
            onClick={() => execCommand("bold")}
            style={{ ...styles.button, ...(isBold ? styles.activeButton : {}) }}
            title="Bold"
          >
            <FiBold style={styles.icon} />
          </button>
          <button
            onClick={() => execCommand("italic")}
            style={{
              ...styles.button,
              ...(isItalic ? styles.activeButton : {}),
            }}
            title="Italic"
          >
            <FiItalic style={styles.icon} />
          </button>
          <button
            onClick={() => execCommand("underline")}
            style={{
              ...styles.button,
              ...(isUnderline ? styles.activeButton : {}),
            }}
            title="Underline"
          >
            <FiUnderline style={styles.icon} />
          </button>
          <select
            onChange={(e) => execCommand("fontSize", e.target.value)}
            style={styles.select}
            title="Font Size"
          >
            <option value="">Size</option>
            {[1, 2, 3, 4, 5, 6, 7].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <select
            onChange={(e) => execCommand("fontName", e.target.value)}
            style={styles.select}
            title="Font Family"
          >
            <option value="">Font</option>
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
          </select>
          <input
            type="color"
            value={currentColor}
            onChange={(e) => {
              const newColor = e.target.value;
              setCurrentColor(newColor);
              execCommand("foreColor", newColor);
            }}
            style={styles.colorInput}
            title="Text Color"
          />
          <button
            onClick={() => execCommand("foreColor", currentColor)}
            style={styles.button}
            title="Apply Current Color"
          >
            <FiType style={{ ...styles.icon, color: currentColor }} />
          </button>
        </div>
        <div style={styles.toolGroup}>
          <button
            onClick={() => execCommand("justifyLeft")}
            style={styles.button}
            title="Align Left"
          >
            <FiAlignLeft style={styles.icon} />
          </button>
          <button
            onClick={() => execCommand("justifyCenter")}
            style={styles.button}
            title="Align Center"
          >
            <FiAlignCenter style={styles.icon} />
          </button>
          <button
            onClick={() => execCommand("justifyRight")}
            style={styles.button}
            title="Align Right"
          >
            <FiAlignRight style={styles.icon} />
          </button>
        </div>
        <div style={styles.toolGroup}>
          <button
            onClick={undo}
            style={styles.button}
            disabled={historyIndex <= 0}
            title="Undo"
          >
            <FiRotateCcw style={styles.icon} />
          </button>
          <button
            onClick={redo}
            style={styles.button}
            disabled={historyIndex >= history.length - 1}
            title="Redo"
          >
            <FiRotateCw style={styles.icon} />
          </button>
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
  editorContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    overflow: "hidden",
    minHeight: "70vh",
    display: "flex",
    flexDirection: "column",
  },
  toolbar: {
    backgroundColor: "#f7f7f7",
    padding: "8px 16px",
    display: "flex",
    gap: "12px",
    alignItems: "center",
    flexWrap: "wrap",
    borderBottom: "1px solid #e5e7eb",
  },
  toolGroup: {
    display: "flex",
    gap: "6px",
    alignItems: "center",
  },
  editorWrapper: {
    flex: 1,
    backgroundColor: "#f9fafb",
    overflow: "auto",
    position: "relative",
  },
  iframe: {
    width: "100%",
    height: "100%",
    border: "none",
    minHeight: "70vh",
    backgroundColor: "#fff",
  },
  button: {
    padding: "6px 10px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    color: "#374151",
    fontWeight: "500",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    ":hover": {
      backgroundColor: "#f3f4f6",
      borderColor: "#d1d5db",
      transform: "translateY(-1px)",
    },
    ":disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
      transform: "none",
    },
  },
  buttonPrimary: {
    padding: "6px 10px",
    backgroundColor: "#3b82f6",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    color: "#ffffff",
    fontWeight: "500",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
    ":hover": {
      backgroundColor: "#2563eb",
      transform: "translateY(-1px)",
    },
    ":disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
      transform: "none",
    },
  },
  activeButton: {
    backgroundColor: "#e5e7eb",
    borderColor: "#d1d5db",
    ":hover": {
      backgroundColor: "#e5e7eb",
    },
  },
  select: {
    padding: "5px 8px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    color: "#374151",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    ":hover": {
      backgroundColor: "#f3f4f6",
      borderColor: "#d1d5db",
    },
  },
  colorInput: {
    padding: "0",
    width: "28px",
    height: "28px",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    cursor: "pointer",
    backgroundColor: "#ffffff",
    transition: "all 0.2s ease",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    ":hover": {
      transform: "scale(1.05)",
    },
  },
  icon: {
    fontSize: "16px",
  },
  buttonText: {
    fontSize: "13px",
    fontWeight: "500",
  },
};

PdfEditor.propTypes = {
  htmlData: PropTypes.string.isRequired,
  setHtmlData: PropTypes.func.isRequired,
  setPdfDataUrl: PropTypes.func.isRequired, // Added for saving PDF
  onCancel: PropTypes.func.isRequired,
};

export default PdfEditor;
