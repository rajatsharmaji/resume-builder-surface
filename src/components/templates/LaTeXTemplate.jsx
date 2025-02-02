/* eslint-disable react/prop-types */
import DraggableSection from "../preview-panel/DraggableSection";

const LaTeXTemplate = ({
  sections,
  finalMode,
  moveSection,
  removeSection,
  handleRightClick,
}) => {
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
      className={finalMode ? "mb-4" : "py-4 my-4 border-b border-gray-300"}
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
    <div
      className="px-12 py-8"
      style={{ fontFamily: "Georgia, serif", lineHeight: "1.6" }}
    >
      {headerSection && (
        <div className="mb-8 border-b pb-4">
          <SectionWrapper section={headerSection} index={0} />
        </div>
      )}
      {otherSections.map((section, i) => (
        <SectionWrapper key={section.id} section={section} index={i} />
      ))}
      {footerSection && (
        <div className="mt-8 border-t pt-4">
          <SectionWrapper section={footerSection} index={0} />
        </div>
      )}
    </div>
  );
};

export default LaTeXTemplate;
