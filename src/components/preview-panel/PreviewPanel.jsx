import PropTypes from "prop-types";
import ResumeGenerator from "../ResumeGenerator";
import ContextMenu from "./ContextMenu";
import { templateComponents } from "../templates";

const PreviewPanel = ({
  sections,
  removeSection,
  contextMenu,
  setContextMenu,
  handleDrop,
  currentTemplate,
  customizations,
  finalMode,
}) => {
  const TemplateComponent =
    templateComponents[currentTemplate] || templateComponents["single-column"];

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md h-full">
      {/* Top header bar */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {finalMode ? "Final Resume Preview" : "Resume Preview"}
        </h2>
      </div>

      {/* Preview area */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add(
            "border-dashed",
            "border-2",
            "border-gray-400"
          );
        }}
        onDragLeave={(e) => {
          e.currentTarget.classList.remove(
            "border-dashed",
            "border-2",
            "border-gray-400"
          );
        }}
        onDrop={handleDrop}
        style={{
          fontFamily: customizations.font,
          fontSize: `${customizations.fontSize}px`,
          color: customizations.textColor,
          backgroundColor: customizations.backgroundColor,
        }}
        className="p-6 rounded-lg shadow-inner h-[calc(100%-100px)]"
      >
        {contextMenu && !finalMode && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(null)}
            onRemove={() => removeSection(contextMenu.sectionId)}
          />
        )}

        {/* Render the chosen template component in edit mode */}
        {!finalMode && (
          <TemplateComponent
            sections={sections}
            customizations={customizations}
          />
        )}

        {/* Render PDF Preview in Final Mode */}
        {finalMode && (
          <div className="h-full">
            <ResumeGenerator disableDownload={!finalMode} />
          </div>
        )}
      </div>
    </div>
  );
};

PreviewPanel.propTypes = {
  resumeRef: PropTypes.object.isRequired,
  sections: PropTypes.array.isRequired,
  moveSection: PropTypes.func.isRequired,
  removeSection: PropTypes.func.isRequired,
  contextMenu: PropTypes.object,
  setContextMenu: PropTypes.func.isRequired,
  handleRightClick: PropTypes.func.isRequired,
  handleDrop: PropTypes.func.isRequired,
  currentTemplate: PropTypes.string.isRequired,
  customizations: PropTypes.shape({
    font: PropTypes.string,
    fontSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    textColor: PropTypes.string,
    backgroundColor: PropTypes.string,
  }).isRequired,
  finalMode: PropTypes.bool.isRequired,
};

export default PreviewPanel;
