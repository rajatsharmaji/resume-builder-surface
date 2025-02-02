/* eslint-disable react/prop-types */
import DraggableSection from "../preview-panel/DraggableSection";

const TwoColumnTemplate = ({
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

  const mid = Math.ceil(otherSections.length / 2);
  const leftSections = otherSections.slice(0, mid);
  const rightSections = otherSections.slice(mid);

  const EmptyColumnMessage = () => (
    <div className="text-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 text-gray-400">
      <p className="text-sm font-medium">Drag sections here to add content</p>
    </div>
  );

  return (
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
};

export default TwoColumnTemplate;
