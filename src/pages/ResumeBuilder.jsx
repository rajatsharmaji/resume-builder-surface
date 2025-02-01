import { useState, useRef } from "react";
import ContextMenu from "../components/ContextMenu";
import useResume from "../hooks/useResume";
import EducationSection from "../components/EducationSection";
import ExperienceSection from "../components/ExperienceSection";
import SkillsSection from "../components/SkillsSection";
import DownloadButton from "../components/DownloadButton";
import AboutSection from "../components/AboutSection";
import ProjectsSection from "../components/ProjectsSection";
import CertificationsSection from "../components/CertificationsSection";

const ResumeBuilder = () => {
  const { sections } = useResume(); // Get sections from global context
  const [contextMenu, setContextMenu] = useState(null);
  const resumeRef = useRef(null);

  const handleRightClick = (e) => {
    e.preventDefault();
    setContextMenu({ x: e.pageX, y: e.pageY });
  };

  return (
    <div
      onContextMenu={handleRightClick}
      className="min-h-screen p-8 bg-gray-100"
    >
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          closeMenu={() => setContextMenu(null)}
        />
      )}
      <div className="relative">
        <div ref={resumeRef} className="bg-white shadow-md p-6 rounded">
          {sections.length > 0 ? (
            sections.map((section) => {
              // Render the correct section based on its type
              switch (section.type) {
                case "education":
                  return (
                    <EducationSection key={section.id} sectionId={section.id} />
                  );
                case "experience":
                  return (
                    <ExperienceSection
                      key={section.id}
                      sectionId={section.id}
                    />
                  );
                case "skills":
                  return (
                    <SkillsSection key={section.id} sectionId={section.id} />
                  );
                case "about":
                  return (
                    <AboutSection key={section.id} sectionId={section.id} />
                  );
                case "projects":
                  return (
                    <ProjectsSection key={section.id} sectionId={section.id} />
                  );
                case "certifications":
                  return (
                    <CertificationsSection
                      key={section.id}
                      sectionId={section.id}
                    />
                  );
                default:
                  return null;
              }
            })
          ) : (
            <p>No content to display</p>
          )}
        </div>
        <div className="mt-4 text-center">
          <DownloadButton contentRef={resumeRef}>
            Download Resume
          </DownloadButton>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
