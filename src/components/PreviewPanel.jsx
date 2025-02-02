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
  // New function to render sections based on template type
  const renderSections = () => {
    if (currentTemplate === "two-column") {
      // Define which section types belong to the left and right columns.
      const leftColumnSections = ["header", "about", "skills"];
      const rightColumnSections = ["experience", "education", "projects"];

      // Filter sections using the section type instead of the unique id.
      const leftSections = sections.filter((section) =>
        leftColumnSections.includes(section.type)
      );
      const rightSections = sections.filter((section) =>
        rightColumnSections.includes(section.type)
      );

      return (
        <>
          {/* Left Column */}
          <div className="space-y-6">
            {leftSections.length > 0 ? (
              leftSections.map((section, index) => (
                <div
                  key={section.id}
                  onContextMenu={(e) => handleRightClick(e, section.id)}
                  className="group relative hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <DraggableSection
                    section={section}
                    index={index}
                    moveSection={moveSection}
                    removeSection={removeSection}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p>Left Column Empty</p>
              </div>
            )}
          </div>
          {/* Right Column */}
          <div className="space-y-6">
            {rightSections.length > 0 ? (
              rightSections.map((section, index) => (
                <div
                  key={section.id}
                  onContextMenu={(e) => handleRightClick(e, section.id)}
                  className="group relative hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <DraggableSection
                    section={section}
                    index={index}
                    moveSection={moveSection}
                    removeSection={removeSection}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p>Right Column Empty</p>
              </div>
            )}
          </div>
        </>
      );
    } else if (currentTemplate === "grid") {
      // In grid, simply let CSS grid place the items
      return sections.map((section, index) => (
        <div
          key={section.id}
          onContextMenu={(e) => handleRightClick(e, section.id)}
          className="group relative hover:bg-gray-50 rounded-lg transition-colors"
        >
          <DraggableSection
            section={section}
            index={index}
            moveSection={moveSection}
            removeSection={removeSection}
          />
        </div>
      ));
    } else {
      // Single-column template
      return sections.map((section, index) => (
        <div
          key={section.id}
          onContextMenu={(e) => handleRightClick(e, section.id)}
          className="group relative hover:bg-gray-50 rounded-lg transition-colors"
        >
          <DraggableSection
            section={section}
            index={index}
            moveSection={moveSection}
            removeSection={removeSection}
          />
        </div>
      ));
    }
  };

  // Compute layout classes for the inner container (which holds the section items)
  const innerContainerClasses = () => {
    switch (currentTemplate) {
      case "two-column":
        return "p-8 grid grid-cols-[2fr_3fr] gap-6";
      case "grid":
        return "p-8 grid grid-cols-2 gap-4";
      default:
        return "p-8 flex flex-col gap-6";
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-4">
      {/* Fixed Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
          <FiLayout className="w-5 h-5" /> Resume Preview
        </h2>
        <DownloadButton contentRef={resumeRef} />
      </div>
      {/* Scrollable Preview Content */}
      <div
        className="rounded-xl shadow-sm border border-gray-100 relative flex-1 overflow-y-auto"
        style={{
          fontFamily: customizations.font,
          fontSize: customizations.fontSize,
          color: customizations.primaryColor,
          backgroundColor: customizations.secondaryColor,
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            closeMenu={() => setContextMenu(null)}
            onRemoveSection={() => removeSection(contextMenu.sectionId)}
          />
        )}
        {/* 
          The inner container now has the layout classes applied directly.
          Its children will be arranged according to the chosen template.
        */}
        <div ref={resumeRef} className={innerContainerClasses()}>
          {renderSections()}
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
  customizations: PropTypes.object.isRequired,
};

export default PreviewPanel;
