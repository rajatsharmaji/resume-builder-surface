/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import { FiLayout } from "react-icons/fi";
import DownloadButton from "./DownloadButton";
import ContextMenu from "./ContextMenu";
import DraggableSection from "./DraggableSection";

const PreviewPanel = ({
  resumeRef,
  sections,
  moveSection,
  removeSection,
  contextMenu,
  setContextMenu,
  handleRightClick,
  handleDrop,
  currentTemplate,
  customizations,
  finalMode, // if true, show a clean final preview
}) => {
  /**
   * SectionWrapper decides how each section is rendered.
   * In finalMode, we skip borders and interactions entirely.
   */
  const SectionWrapper = ({ section, index }) => {
    return (
      <div
        onContextMenu={(e) => {
          // Only allow context menu if not in final mode
          if (!finalMode) handleRightClick(e, section.id);
        }}
        className={
          finalMode
            ? "mb-4"
            : "group relative hover:bg-gray-50 rounded-lg transition-all duration-200 border border-transparent hover:border-gray-200 mb-4"
        }
      >
        <DraggableSection
          section={section}
          index={index}
          finalMode={finalMode}
          moveSection={moveSection}
          removeSection={removeSection}
        />
      </div>
    );
  };

  const EmptyColumnMessage = () => (
    <div className="text-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 text-gray-400">
      Drag sections here to add content
    </div>
  );

  /**
   * Helper functions to render different layout templates:
   * - Two-column
   * - Grid
   * - Single column
   */
  const renderColumns = (leftTypes, rightTypes) => {
    const leftSections = sections.filter((s) => leftTypes.includes(s.type));
    const rightSections = sections.filter((s) => rightTypes.includes(s.type));

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {leftSections.map((section, i) => (
            <SectionWrapper key={section.id} section={section} index={i} />
          ))}
          {leftSections.length === 0 && <EmptyColumnMessage />}
        </div>
        <div className="space-y-6">
          {rightSections.map((section, i) => (
            <SectionWrapper key={section.id} section={section} index={i} />
          ))}
          {rightSections.length === 0 && <EmptyColumnMessage />}
        </div>
      </div>
    );
  };

  const renderGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sections.map((section, i) => (
        <SectionWrapper key={section.id} section={section} index={i} />
      ))}
    </div>
  );

  const renderSingleColumn = () => (
    <div className="space-y-6">
      {sections.map((section, i) => (
        <SectionWrapper key={section.id} section={section} index={i} />
      ))}
    </div>
  );

  return (
    <div className="flex-1 flex flex-col gap-4 h-full">
      {/* 
        Top header bar:
        - In edit mode, show "Resume Preview" + Download button (which can be disabled).
        - In final mode, show a simpler header. 
      */}
      {!finalMode && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FiLayout className="text-blue-600" />
            <span className="text-gray-800">Resume Preview</span>
          </h2>
          {/* Download button is disabled unless finalMode is toggled */}
          <DownloadButton contentRef={resumeRef} disableDownload={!finalMode} />
        </div>
      )}

      {finalMode && (
        <div className="px-4 py-3 bg-white border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Final Resume Preview
          </h2>
          {/* If you want the download button visible in final mode, show it here: */}
          <div className="mt-2">
            <DownloadButton contentRef={resumeRef} disableDownload={false} />
          </div>
        </div>
      )}

      {/* Preview area */}
      <div
        className="flex-1 overflow-auto bg-gray-50 p-6"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        style={{
          fontFamily: customizations.font,
          fontSize: `${customizations.fontSize}px`,
          color: customizations.textColor,
          backgroundColor: customizations.backgroundColor,
        }}
      >
        <div
          ref={resumeRef}
          className="mx-auto max-w-4xl bg-white rounded-xl shadow-sm p-8 transition-all duration-300"
        >
          {/* Context Menu only in edit mode */}
          {contextMenu && !finalMode && (
            <ContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              onClose={() => setContextMenu(null)}
              onRemove={() => removeSection(contextMenu.sectionId)}
            />
          )}

          {/* Render based on the chosen template */}
          {currentTemplate === "two-column"
            ? renderColumns(
                ["header", "about", "skills"],
                ["experience", "education", "projects"]
              )
            : currentTemplate === "grid"
            ? renderGrid()
            : renderSingleColumn()}
        </div>
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
