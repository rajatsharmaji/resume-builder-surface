/* eslint-disable react/prop-types */
import DraggableSection from "../preview-panel/DraggableSection";

const DefaultTemplate = ({
  sections,
  finalMode,
  moveSection,
  removeSection,
  handleRightClick,
}) => {
  // Separate header and footer from other sections
  const headerSection = sections.find((s) => s.type === "header");
  const footerSection = sections.find((s) => s.type === "footer");
  const otherSections = sections.filter(
    (s) => s.type !== "header" && s.type !== "footer"
  );

  const SectionWrapper = ({ section, index }) => (
    <div
      onContextMenu={(e) => {
        if (!finalMode) handleRightClick(e, section.id);
      }}
      className={finalMode ? "mb-4" : "mb-4"}
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

  return (
    <>
      {headerSection && <SectionWrapper section={headerSection} index={0} />}
      {otherSections.map((section, index) => (
        <SectionWrapper key={section.id} section={section} index={index} />
      ))}
      {footerSection && <SectionWrapper section={footerSection} index={0} />}
    </>
  );
};

export default DefaultTemplate;
