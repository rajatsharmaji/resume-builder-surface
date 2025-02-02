/* eslint-disable react/prop-types */
// src/components/PreviewPanel.jsx
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
  // Separate header and footer from other sections
  const headerSection = sections.find((s) => s.type === "header");
  const footerSection = sections.find((s) => s.type === "footer");
  const otherSections = sections.filter(
    (s) => s.type !== "header" && s.type !== "footer"
  );

  // SectionWrapper wraps each section
  const SectionWrapper = ({ section, index }) => {
    return (
      <div
        onContextMenu={(e) => {
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
      <p className="text-sm font-medium">Drag sections here to add content</p>
    </div>
  );

  // Render layout based on currentTemplate
  let content;
  if (currentTemplate === "two-column") {
    // In two-column mode, header and footer are rendered separately.
    // The remaining sections are split evenly.
    const mid = Math.ceil(otherSections.length / 2);
    const leftSections = otherSections.slice(0, mid);
    const rightSections = otherSections.slice(mid);
    content = (
      <>
        {headerSection && <SectionWrapper section={headerSection} index={0} />}
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
        {footerSection && <SectionWrapper section={footerSection} index={0} />}
      </>
    );
  } else if (currentTemplate === "grid") {
    // In grid mode, header is at the top and footer at the bottom.
    content = (
      <>
        {headerSection && <SectionWrapper section={headerSection} index={0} />}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {otherSections.map((section, i) => (
            <SectionWrapper key={section.id} section={section} index={i} />
          ))}
        </div>
        {footerSection && <SectionWrapper section={footerSection} index={0} />}
      </>
    );
  } else {
    // Single-column: header, then other sections, then footer.
    content = (
      <>
        {headerSection && <SectionWrapper section={headerSection} index={0} />}
        {otherSections.map((section, i) => (
          <SectionWrapper key={section.id} section={section} index={i} />
        ))}
        {footerSection && <SectionWrapper section={footerSection} index={0} />}
      </>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-4 h-full">
      {/* Top header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FiLayout className="text-blue-600" />
          <span className="text-gray-800">
            {finalMode ? "Final Resume Preview" : "Resume Preview"}
          </span>
        </h2>
        {/* Hide DownloadButton in Edit Mode */}
        {finalMode && (
          <DownloadButton contentRef={resumeRef} disableDownload={false} />
        )}
      </div>

      {/* Preview area */}
      <div
        className="flex-1 overflow-auto bg-gray-50 p-6"
        onDragOver={(e) => {
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
      >
        <div
          ref={resumeRef}
          className="mx-auto max-w-4xl bg-white rounded-xl shadow-sm p-8 transition-all duration-300"
        >
          {contextMenu && !finalMode && (
            <ContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              onClose={() => setContextMenu(null)}
              onRemove={() => removeSection(contextMenu.sectionId)}
            />
          )}
          {content}
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
