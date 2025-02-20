import PropTypes from "prop-types";
import ResumeGenerator from "../ResumeGenerator";
import ContextMenu from "./ContextMenu";
import DraggableSection from "../preview-panel/DraggableSection";

const PreviewPanel = ({
  sections,
  removeSection,
  contextMenu,
  setContextMenu,
  handleDrop,
  customizations,
  finalMode,
}) => {
  // Separate header and footer from other sections
  const headerSection = sections.find((s) => s.type === "header");
  const footerSection = sections.find((s) => s.type === "footer");
  const otherSections = sections.filter(
    (s) => s.type !== "header" && s.type !== "footer"
  );

  const SectionWrapper = ({ section: { id, type, ...restSection }, index }) => (
    <div
      onContextMenu={(e) => {
        if (!finalMode)
          setContextMenu({ x: e.clientX, y: e.clientY, sectionId: id });
      }}
      className="mb-4"
    >
      <DraggableSection
        section={{ id, type, ...restSection }}
        index={index}
        finalMode={finalMode}
        moveSection={() => {}} // Assuming moveSection is not required in PreviewPanel
        removeSection={removeSection}
      />
    </div>
  );

  SectionWrapper.propTypes = {
    section: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      type: PropTypes.string.isRequired,
    }).isRequired,
    index: PropTypes.number.isRequired,
  };

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
          <>
            {headerSection && (
              <SectionWrapper section={headerSection} index={0} />
            )}
            {otherSections.map((section, index) => (
              <SectionWrapper
                key={section.id}
                section={section}
                index={index}
              />
            ))}
            {footerSection && (
              <SectionWrapper section={footerSection} index={0} />
            )}
          </>
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
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      type: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  removeSection: PropTypes.func.isRequired,
  contextMenu: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    sectionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  setContextMenu: PropTypes.func.isRequired,
  handleDrop: PropTypes.func.isRequired,
  customizations: PropTypes.shape({
    font: PropTypes.string.isRequired,
    fontSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    textColor: PropTypes.string.isRequired,
    backgroundColor: PropTypes.string.isRequired,
  }).isRequired,
  finalMode: PropTypes.bool.isRequired,
};

export default PreviewPanel;
