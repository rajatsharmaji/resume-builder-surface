// import PropTypes from "prop-types";
// import { FiLayout } from "react-icons/fi";
// import DownloadButton from "../DownloadButton";
// import ContextMenu from "./ContextMenu";
// // Import the mapping of templates
// import { templateComponents } from "../templates";

// const PreviewPanel = ({
//   resumeRef,
//   sections,
//   moveSection,
//   removeSection,
//   contextMenu,
//   setContextMenu,
//   handleRightClick,
//   handleDrop,
//   currentTemplate, // e.g. "latex", "two-column", "grid", or "single-column"
//   customizations,
//   finalMode, // if true, show a clean final preview
// }) => {
//   // Select the template component based on currentTemplate.
//   // If none is found, fallback to the "single-column" template.
//   const TemplateComponent =
//     templateComponents[currentTemplate] || templateComponents["single-column"];

//   return (
//     <div className="flex-1 flex flex-col gap-4 h-full">
//       {/* Top header bar */}
//       <div className="flex items-center justify-between px-4 py-3 bg-white border-b">
//         <h2 className="text-lg font-semibold flex items-center gap-2">
//           <FiLayout className="text-blue-600" />
//           <span className="text-gray-800">
//             {finalMode ? "Final Resume Preview" : "Resume Preview"}
//           </span>
//         </h2>
//         {/* Only show the DownloadButton in Final Mode */}
//         {finalMode && (
//           <DownloadButton contentRef={resumeRef} disableDownload={false} />
//         )}
//       </div>

//       {/* Preview area */}
//       <div
//         className="flex-1 overflow-auto bg-gray-50 p-6"
//         onDragOver={(e) => {
//           e.preventDefault();
//           e.currentTarget.classList.add(
//             "border-dashed",
//             "border-2",
//             "border-gray-400"
//           );
//         }}
//         onDragLeave={(e) => {
//           e.currentTarget.classList.remove(
//             "border-dashed",
//             "border-2",
//             "border-gray-400"
//           );
//         }}
//         onDrop={handleDrop}
//         style={{
//           fontFamily: customizations.font,
//           fontSize: `${customizations.fontSize}px`,
//           color: customizations.textColor,
//           backgroundColor: customizations.backgroundColor,
//         }}
//       >
//         <div
//           ref={resumeRef}
//           className="mx-auto max-w-4xl bg-white rounded-xl shadow-sm p-8 transition-all duration-300"
//         >
//           {contextMenu && !finalMode && (
//             <ContextMenu
//               x={contextMenu.x}
//               y={contextMenu.y}
//               onClose={() => setContextMenu(null)}
//               onRemove={() => removeSection(contextMenu.sectionId)}
//             />
//           )}
//           {/* Render the chosen template component */}
//           <TemplateComponent
//             sections={sections}
//             finalMode={finalMode}
//             moveSection={moveSection}
//             removeSection={removeSection}
//             handleRightClick={handleRightClick}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// PreviewPanel.propTypes = {
//   resumeRef: PropTypes.object.isRequired,
//   sections: PropTypes.array.isRequired,
//   moveSection: PropTypes.func.isRequired,
//   removeSection: PropTypes.func.isRequired,
//   contextMenu: PropTypes.object,
//   setContextMenu: PropTypes.func.isRequired,
//   handleRightClick: PropTypes.func.isRequired,
//   handleDrop: PropTypes.func.isRequired,
//   currentTemplate: PropTypes.string.isRequired,
//   customizations: PropTypes.shape({
//     font: PropTypes.string,
//     fontSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
//     textColor: PropTypes.string,
//     backgroundColor: PropTypes.string,
//   }).isRequired,
//   finalMode: PropTypes.bool.isRequired,
// };

// export default PreviewPanel;

import PropTypes from "prop-types";
// import DownloadButton from "../DownloadButton";
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
    <div>
      {/* Top header bar */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {finalMode ? "Final Resume Preview" : "Resume Preview"}
        </h2>
        {/* Only show the DownloadButton in Final Mode */}
        {finalMode && <ResumeGenerator disableDownload={!finalMode} />}
      </div>

      {/* Preview area */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={(e) => {
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
        {contextMenu && !finalMode && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(null)}
            onRemove={() => removeSection(contextMenu.sectionId)}
          />
        )}
        {/* Render the chosen template component */}
        <TemplateComponent
          sections={sections}
          customizations={customizations}
        />
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
