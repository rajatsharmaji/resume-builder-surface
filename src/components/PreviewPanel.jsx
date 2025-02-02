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
}) => {
  const renderColumns = (leftTypes, rightTypes) => {
    const leftSections = sections.filter((s) => leftTypes.includes(s.type));
    const rightSections = sections.filter((s) => rightTypes.includes(s.type));

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {leftSections.map((section, index) => (
            <SectionWrapper
              key={section.id}
              section={section}
              index={index}
              handleRightClick={handleRightClick}
              moveSection={moveSection}
              removeSection={removeSection}
            />
          ))}
          {leftSections.length === 0 && <EmptyColumnMessage />}
        </div>

        <div className="space-y-6">
          {rightSections.map((section, index) => (
            <SectionWrapper
              key={section.id}
              section={section}
              index={index}
              handleRightClick={handleRightClick}
              moveSection={moveSection}
              removeSection={removeSection}
            />
          ))}
          {rightSections.length === 0 && <EmptyColumnMessage />}
        </div>
      </div>
    );
  };

  const renderGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sections.map((section, index) => (
        <SectionWrapper
          key={section.id}
          section={section}
          index={index}
          handleRightClick={handleRightClick}
          moveSection={moveSection}
          removeSection={removeSection}
        />
      ))}
    </div>
  );

  const renderSingleColumn = () => (
    <div className="space-y-6">
      {sections.map((section, index) => (
        <SectionWrapper
          key={section.id}
          section={section}
          index={index}
          handleRightClick={handleRightClick}
          moveSection={moveSection}
          removeSection={removeSection}
        />
      ))}
    </div>
  );

  return (
    <div className="flex-1 flex flex-col gap-4 h-full">
      {/* Header with Download Button */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FiLayout className="text-blue-600" />
          <span className="text-gray-800">Resume Preview</span>
        </h2>
        <DownloadButton contentRef={resumeRef} />
      </div>

      {/* Preview Area */}
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
          {contextMenu && (
            <ContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              onClose={() => setContextMenu(null)}
              onRemove={() => removeSection(contextMenu.sectionId)}
            />
          )}

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

// Helper components
const SectionWrapper = ({ section, index, handleRightClick, ...props }) => (
  <div
    onContextMenu={(e) => handleRightClick(e, section.id)}
    className="group relative hover:bg-gray-50 rounded-lg transition-all duration-200 border border-transparent hover:border-gray-200"
  >
    <DraggableSection
      section={section}
      index={index}
      {...props}
      className="p-4 hover:bg-opacity-50 transition-colors"
    />
  </div>
);

const EmptyColumnMessage = () => (
  <div className="text-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 text-gray-400">
    Drag sections here to add content
  </div>
);

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
    fontSize: PropTypes.number,
    textColor: PropTypes.string,
    backgroundColor: PropTypes.string,
  }).isRequired,
};

export default PreviewPanel;
