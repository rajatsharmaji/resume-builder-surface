import { useRef, useState, useEffect, useContext, useCallback } from "react";
import useResume from "../hooks/useResume";
import ElementsPanel from "../components/left-panel/ElementsPanel";
import LayersPanel from "../components/left-panel/LayersPanel";
import PreviewPanel from "../components/preview-panel/PreviewPanel";
import RightPanel from "../components/right-panel/RightPanel";
import {
  FiAward,
  FiBook,
  FiBriefcase,
  FiCode,
  FiFileText,
  FiLayout,
  FiUser,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { MdFlashOn, MdSettings } from "react-icons/md";
import { ResumeContext } from "../context/resume-context";
import ResumeGenerator from "../components/ResumeGenerator";
import Loader from "../components/common/Loader";
import axios from "axios";

// ─── CUSTOM HOOK: useResumeGeneration ─────────────────────────────
// This hook encapsulates the business logic for constructing the resume payload and calling the API.
const useResumeGeneration = () => {
  const { sectionsData } = useContext(ResumeContext);
  const [pdfDataUrl, setPdfDataUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const constructResumePayload = useCallback(() => {
    const dataArray = Object.keys(sectionsData).map((key) => ({
      id: key,
      ...sectionsData[key],
    }));

    const resume = {};

    // HEADER
    const headerSection = dataArray.find((s) => !s.type || s.type === "header");
    if (headerSection && headerSection.content) {
      const names = headerSection.content.name.split(" ");
      resume.firstName = names[0] || "";
      resume.lastName = names.slice(1).join(" ") || "";
      resume.email = headerSection.content.email || "";
      resume.phone = headerSection.content.phone || "";
      resume.website =
        headerSection.content.linkedin || headerSection.content.github || "";
      resume.links = {};
      if (headerSection.content.linkedin) {
        resume.links["LinkedIn"] = headerSection.content.linkedin;
      }
      if (headerSection.content.github) {
        resume.links["GitHub"] = headerSection.content.github;
      }
    }

    // ABOUT
    const aboutSection = dataArray.find((s) => s.type === "about");
    if (aboutSection && aboutSection.content) {
      resume.about = aboutSection.content.about || "";
    }

    // EDUCATION
    const educationSection = dataArray.find((s) => s.type === "education");
    if (
      educationSection &&
      educationSection.content &&
      educationSection.content.education
    ) {
      resume.education = educationSection.content.education.map((edu) => ({
        institution: edu.school,
        degree: edu.degree,
        graduationDate: edu.year,
        location: edu.location || "",
        gpa: edu.gpa || "",
      }));
    } else {
      resume.education = [];
    }

    // EXPERIENCE
    const experienceSection = dataArray.find((s) => s.type === "experience");
    if (
      experienceSection &&
      experienceSection.content &&
      experienceSection.content.experience
    ) {
      resume.experience = experienceSection.content.experience.map((exp) => ({
        company: exp.company,
        position: exp.role,
        startDate: exp.startDate || "",
        endDate: exp.endDate || "",
        location: exp.location || "",
        details: exp.description ? [exp.description] : [],
      }));
    } else {
      resume.experience = [];
    }

    // SKILLS
    const skillsSection = dataArray.find((s) => s.type === "skills");
    if (
      skillsSection &&
      skillsSection.content &&
      skillsSection.content.skills
    ) {
      resume.skills = [
        {
          category: "Technical Skills",
          skills: skillsSection.content.skills,
        },
      ];
    } else {
      resume.skills = [];
    }

    // PROJECTS
    const projectsSection = dataArray.find((s) => s.type === "projects");
    if (
      projectsSection &&
      projectsSection.content &&
      projectsSection.content.projects
    ) {
      resume.projects = projectsSection.content.projects.map((proj) => ({
        title: proj.title,
        subtitle: "",
        dateRange: "",
        tools: [],
        details: proj.description ? [proj.description] : [],
        link: proj.link || "",
      }));
    } else {
      resume.projects = [];
    }

    // CERTIFICATIONS mapped to awards
    const certificationsSection = dataArray.find(
      (s) => s.type === "certifications"
    );
    if (
      certificationsSection &&
      certificationsSection.content &&
      certificationsSection.content.certifications
    ) {
      resume.awards = certificationsSection.content.certifications.map(
        (cert) => ({
          title: cert,
          organization: "",
          date: "",
        })
      );
    } else {
      resume.awards = [];
    }

    // Template from localStorage
    const currentTemplate =
      localStorage.getItem("selectedTemplate") || "default";
    resume.template = currentTemplate;
    return resume;
  }, [sectionsData]);

  const generateResume = async () => {
    setIsLoading(true);
    setError(null);
    setPdfDataUrl(null);

    const payload = constructResumePayload();
    console.log("Generating resume with payload:", payload);
    try {
      const response = await axios.post(
        "http://localhost:3008/api/v1/resume/generate",
        payload,
        { responseType: "arraybuffer" }
      );

      if (response.status !== 200) {
        throw new Error(`Unexpected response status: ${response.status}`);
      }

      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfDataUrl(pdfUrl);
    } catch (err) {
      console.error("Error generating resume:", err);
      setError("Failed to generate resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return { pdfDataUrl, isLoading, error, generateResume, setPdfDataUrl };
};

const ResumeBuilder = () => {
  const { sections, addSection, moveSection, removeSection } = useResume();
  const { sectionsData } = useContext(ResumeContext);
  const [contextMenu, setContextMenu] = useState(null);
  const resumeRef = useRef(null);

  const defaultTemplate = "deedy-cv";
  const [customizations, setCustomizations] = useState({
    font: "Roboto, sans-serif",
    fontSize: 16,
    primaryColor: "#007BFF",
    secondaryColor: "#F8F9FA",
    spacing: "1rem",
    textColor: "#000000",
    backgroundColor: "#ffffff",
    template: defaultTemplate,
  });

  useEffect(() => {
    const storedTemplate = localStorage.getItem("selectedTemplate");
    if (storedTemplate) {
      setCustomizations((prev) => ({ ...prev, template: storedTemplate }));
    } else {
      localStorage.setItem("selectedTemplate", defaultTemplate);
    }
  }, []);

  const handleApplyTemplate = (templateId) => {
    setCustomizations((prev) => {
      const newCustomizations = { ...prev, template: templateId };
      localStorage.setItem("selectedTemplate", templateId);
      return newCustomizations;
    });
  };

  const [finalMode, setFinalMode] = useState(false);
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);

  const sectionTypes = [
    { id: "header", label: "Header", icon: <FiUser />, color: "bg-red-100" },
    { id: "about", label: "About", icon: <FiFileText />, color: "bg-blue-100" },
    {
      id: "experience",
      label: "Experience",
      icon: <FiBriefcase />,
      color: "bg-green-100",
    },
    {
      id: "education",
      label: "Education",
      icon: <FiBook />,
      color: "bg-yellow-100",
    },
    { id: "skills", label: "Skills", icon: <FiCode />, color: "bg-purple-100" },
    {
      id: "projects",
      label: "Projects",
      icon: <FiAward />,
      color: "bg-indigo-100",
    },
    {
      id: "certifications",
      label: "Certifications",
      icon: <FiAward />,
      color: "bg-pink-100",
    },
    { id: "footer", label: "Footer", icon: <FiLayout />, color: "bg-red-100" },
  ];

  const handleAddSectionUnique = (sectionType) => {
    if (sections.some((s) => s.type === sectionType)) return;
    addSection(sectionType);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const existingSectionId = e.dataTransfer.getData(
      "application/existing-section"
    );
    const newSectionId = e.dataTransfer.getData("sectionId");

    const previewRect = resumeRef.current.getBoundingClientRect();
    const dropY = e.clientY - previewRect.top;
    const sectionNodes = Array.from(
      resumeRef.current.querySelectorAll(".draggable-section")
    );
    let insertIndex = sections.length;

    for (let i = 0; i < sectionNodes.length; i++) {
      const node = sectionNodes[i];
      const nodeRect = node.getBoundingClientRect();
      const nodeMidpoint = nodeRect.top - previewRect.top + nodeRect.height / 2;
      if (dropY < nodeMidpoint) {
        insertIndex = i;
        break;
      }
    }

    const headerIndex = sections.findIndex((s) => s.type === "header");
    const footerIndex = sections.findIndex((s) => s.type === "footer");

    if (headerIndex !== -1 && insertIndex === 0) insertIndex = 1;
    if (footerIndex !== -1 && insertIndex >= footerIndex)
      insertIndex = footerIndex - 1;

    if (existingSectionId) {
      const draggedSection = sections.find((s) => s.id === existingSectionId);
      if (!draggedSection) return;
      if (["header", "footer"].includes(draggedSection.type)) return;
      moveSection(existingSectionId, insertIndex);
    } else if (newSectionId) {
      if (sections.some((s) => s.type === newSectionId)) return;
      addSection(newSectionId, insertIndex);
    }
  };

  const handleRightClick = (e, id) => {
    e.preventDefault();
    if (!finalMode) setContextMenu({ x: e.pageX, y: e.pageY, sectionId: id });
  };

  // Use the custom hook to manage resume generation.
  const { pdfDataUrl, isLoading, error, generateResume, setPdfDataUrl } =
    useResumeGeneration();

  // When "Generate" is clicked, log section data, call the API, and switch to preview mode.
  const handleGenerate = async () => {
    sections.forEach((section) => {
      const data = sectionsData[section.id] || {};
      console.log(
        `Section Data for ${section.type} (ID: ${section.id}):`,
        data
      );
    });
    await generateResume();
    setFinalMode(true);
  };

  // Switch back to edit mode.
  const handleEdit = () => {
    setFinalMode(false);
  };

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Mobile Toggle Buttons */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setShowLeftPanel(true)}
          className="p-2 bg-white rounded-lg shadow-md focus:outline-none active:scale-95 transition-transform border border-gray-200"
        >
          <FiMenu className="w-5 h-5 text-gray-700" />
        </button>
      </div>
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setShowRightPanel(true)}
          className="p-2 bg-white rounded-lg shadow-md focus:outline-none active:scale-95 transition-transform border border-gray-200"
        >
          <MdSettings className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Desktop Left Panel */}
      <div className="hidden md:flex flex-col w-64 border-r border-gray-200 p-4">
        <div className="mb-4 flex-1 overflow-y-auto">
          <ElementsPanel
            sectionTypes={sectionTypes}
            addSection={handleAddSectionUnique}
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          <LayersPanel
            sections={sections}
            moveSection={moveSection}
            removeSection={removeSection}
          />
        </div>
      </div>

      {/* Mobile Left Panel */}
      {showLeftPanel && (
        <div className="md:hidden fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40">
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                Elements & Layers
              </h3>
              <button
                onClick={() => setShowLeftPanel(false)}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiX className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
              <div className="flex-1 overflow-y-auto">
                <ElementsPanel
                  sectionTypes={sectionTypes}
                  addSection={handleAddSectionUnique}
                  mobile
                />
              </div>
              <div className="border-t pt-4 flex-1 overflow-y-auto">
                <LayersPanel
                  sections={sections}
                  moveSection={moveSection}
                  removeSection={removeSection}
                  mobile
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Preview Area */}
      <div
        className="flex-1 p-4 relative overflow-hidden w-full md:max-w-4xl mx-auto mt-12 md:mt-0"
        ref={resumeRef}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {/* Header with Always-Visible Generate Button and (in preview mode) Edit Mode Button */}
        <div className="flex justify-between items-center mb-4 space-x-4">
          <h2 className="text-xl font-bold text-gray-800">
            {finalMode ? "Preview" : "Builder"}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="relative inline-flex items-center justify-center rounded-lg border border-blue-500 bg-transparent px-4 py-2 text-sm font-medium text-blue-600 shadow-sm transition-all duration-300 hover:bg-blue-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              {isLoading ? (
                <Loader size="sm" className="mr-2" />
              ) : (
                <span className="flex items-center gap-2">
                  <MdFlashOn className="w-4 h-4" />
                  <span>Generate</span>
                </span>
              )}
            </button>
            {finalMode && (
              <button
                onClick={handleEdit}
                className="relative inline-flex items-center justify-center rounded-lg border border-green-500 bg-transparent px-4 py-2 text-sm font-medium text-green-600 shadow-sm transition-all duration-300 hover:bg-green-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-100"
              >
                <span className="flex items-center gap-2">
                  <MdFlashOn className="w-4 h-4" />
                  <span>Edit Mode</span>
                </span>
              </button>
            )}
          </div>
        </div>
        {finalMode ? (
          <ResumeGenerator
            pdfDataUrl={pdfDataUrl}
            isLoading={isLoading}
            error={error}
            setPdfDataUrl={setPdfDataUrl}
            disableDownload={false}
          />
        ) : (
          <PreviewPanel
            resumeRef={resumeRef}
            sections={sections}
            removeSection={removeSection}
            contextMenu={contextMenu}
            setContextMenu={setContextMenu}
            handleRightClick={handleRightClick}
            handleDrop={handleDrop}
            currentTemplate="default"
            customizations={customizations}
            finalMode={finalMode}
            mobile={!finalMode}
          />
        )}
      </div>

      {/* Desktop Right Panel */}
      <div className="hidden md:block w-64 border-l border-gray-200 p-4 overflow-y-auto">
        <RightPanel
          customizations={customizations}
          applyTemplate={handleApplyTemplate}
        />
      </div>

      {/* Mobile Right Panel - Fixed */}
      {showRightPanel && (
        <div className="md:hidden fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40">
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-white p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                Customization
              </h3>
              <button
                onClick={() => setShowRightPanel(false)}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiX className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <RightPanel
                customizations={customizations}
                applyTemplate={(templateId) => {
                  handleApplyTemplate(templateId);
                  setShowRightPanel(false);
                }}
                mobile
              />
            </div>

            <div className="pt-4 border-t">
              <button
                onClick={() => setShowRightPanel(false)}
                className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                Close Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder;
