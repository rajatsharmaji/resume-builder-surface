/* eslint-disable react/prop-types */
import { FiLayout, FiPlus } from "react-icons/fi";
import DraggableSection from "./DraggableSection";
import ContextMenu from "./ContextMenu";
import DownloadButton from "./DownloadButton";

const PreviewPanel = ({
  resumeRef,
  sections,
  moveSection,
  removeSection,
  contextMenu,
  setContextMenu,
  handleRightClick,
  handleDrop,
}) => {
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
        className="bg-white rounded-xl shadow-sm border border-gray-100 relative flex-1 overflow-y-auto"
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
        <div ref={resumeRef} className="p-8 space-y-6">
          {sections && sections.length > 0 ? (
            sections.map((section, index) => (
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
              <FiPlus className="w-12 h-12 mx-auto mb-4" />
              <p>Click buttons on the left to add sections</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;
