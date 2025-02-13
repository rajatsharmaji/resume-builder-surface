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
    <div className="bg-gray-100 rounded-lg shadow-md w-full h-full flex flex-col">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        style={{
          fontFamily: customizations.font,
          fontSize: `${customizations.fontSize}px`,
          color: customizations.textColor,
          backgroundColor: customizations.backgroundColor,
        }}
        className="flex-1 overflow-y-auto overflow-x-hidden p-1"
      >
        {contextMenu && !finalMode && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            closeMenu={() => setContextMenu(null)}
            onRemoveSection={() => removeSection(contextMenu.sectionId)}
          />
        )}

        {!finalMode ? (
          <TemplateComponent
            sections={sections}
            customizations={customizations}
            removeSection={removeSection}
            finalMode={finalMode}
          />
        ) : (
          <div className="flex-grow">
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
  removeSection: PropTypes.func.isRequired,
  contextMenu: PropTypes.object,
  setContextMenu: PropTypes.func.isRequired,
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
