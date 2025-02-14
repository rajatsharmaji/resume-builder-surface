import { useState, useEffect, useContext, useCallback } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { FiDownload, FiEdit } from "react-icons/fi";
import Loader from "./common/Loader";
import PdfPreviewer from "./PdfPreviewer";
import PdfEditor from "./PdfEditor";
import { ResumeContext } from "../context/resume-context";

const ResumeGenerator = ({ className = "", disableDownload = true }) => {
  const { sectionsData } = useContext(ResumeContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pdfDataUrl, setPdfDataUrl] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Construct the payload matching your sample data format and backend template.
  const constructResumePayload = useCallback(() => {
    // Convert the sectionsData object into an array.
    const dataArray = Object.keys(sectionsData).map((key) => ({
      id: key,
      ...sectionsData[key],
    }));

    const resume = {};

    // HEADER (assume header has no explicit type or type === "header")
    const headerSection = dataArray.find((s) => !s.type || s.type === "header");
    if (headerSection && headerSection.content) {
      const names = headerSection.content.name.split(" ");
      resume.firstName = names[0] || "";
      resume.lastName = names.slice(1).join(" ") || "";
      resume.email = headerSection.content.email || "";
      resume.phone = headerSection.content.phone || "";
      // Use linkedin as website if available; fallback to github.
      resume.website =
        headerSection.content.linkedin || headerSection.content.github || "";
      // Also store links separately for the backend.
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
      // Map each education item (sample uses "school", "degree", "year")
      resume.education = educationSection.content.education.map((edu) => ({
        institution: edu.school, // map "school" to "institution"
        degree: edu.degree,
        graduationDate: edu.year, // map "year" to graduationDate
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
      // Map each experience item. In your sample, each item has company, role, description.
      resume.experience = experienceSection.content.experience.map((exp) => ({
        company: exp.company,
        position: exp.role, // map "role" to "position"
        startDate: exp.startDate || "", // you may add these if available
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
      // Wrap the skills array in a group with a default category.
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
      // Map each project. Your sample provides title, description, and link.
      resume.projects = projectsSection.content.projects.map((proj) => ({
        title: proj.title,
        subtitle: "", // no subtitle provided
        dateRange: "", // not provided
        tools: [], // not provided
        details: proj.description ? [proj.description] : [],
        link: proj.link || "",
      }));
    } else {
      resume.projects = [];
    }

    // CERTIFICATIONS mapped to awards (for backend template)
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

    return resume;
  }, [sectionsData]);

  useEffect(() => {
    if (!disableDownload && !pdfDataUrl && !isLoading) {
      const generateResume = async () => {
        setIsLoading(true);
        setError(null);

        // Build the payload with real data.
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

          const pdfBlob = new Blob([response.data], {
            type: "application/pdf",
          });
          const pdfUrl = URL.createObjectURL(pdfBlob);
          setPdfDataUrl(pdfUrl);
        } catch (err) {
          console.error("Error generating resume:", err);
          if (err.response && err.response.data) {
            try {
              const errorMsg = new TextDecoder("utf-8").decode(
                err.response.data
              );
              setError(`Failed to generate resume: ${errorMsg}`);
            } catch {
              setError("Failed to generate resume. Please try again.");
            }
          } else {
            setError("Failed to generate resume. Please try again.");
          }
        } finally {
          setIsLoading(false);
        }
      };

      generateResume();
    }
  }, [disableDownload, pdfDataUrl, isLoading, constructResumePayload]);

  const handleDownload = () => {
    if (!pdfDataUrl) return;
    const link = document.createElement("a");
    link.href = pdfDataUrl;
    link.download = "resume.pdf";
    link.click();
  };

  return (
    <div className={`p-0 bg-white rounded-lg shadow-md ${className}`}>
      <div className="mb-6">
        {isLoading && (
          <div className="flex items-center text-blue-600">
            <Loader size="md" className="mr-2" />
            <span>Generating PDF…</span>
          </div>
        )}
        {error && <p className="text-red-500">{error}</p>}
      </div>

      {pdfDataUrl && (
        <>
          <div className="h-[calc(100vh-200px)]">
            <PdfPreviewer pdfDataUrl={pdfDataUrl} />
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={handleDownload}
              className="relative inline-flex items-center justify-center overflow-hidden rounded border border-purple-600 bg-transparent px-5 py-2 font-medium text-purple-600 shadow-sm transition-all duration-300 hover:bg-purple-50 hover:shadow-md hover:-translate-y-0.25 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:ring-offset-2 active:translate-y-0"
            >
              <span className="relative flex items-center gap-2 text-sm">
                <FiDownload className="w-4 h-4 text-purple-600 transition-transform duration-300 group-hover:scale-110" />
                <span className="tracking-normal">Download PDF</span>
              </span>
            </button>
            <button
              onClick={() => setIsEditMode(true)}
              className="relative inline-flex items-center justify-center overflow-hidden rounded border border-yellow-500 bg-transparent px-5 py-2 font-medium text-yellow-600 shadow-sm transition-all duration-300 hover:bg-yellow-50 hover:shadow-md hover:-translate-y-0.25 focus:outline-none focus:ring-2 focus:ring-yellow-100 focus:ring-offset-2 active:translate-y-0"
            >
              <span className="relative flex items-center gap-2 text-sm">
                <FiEdit className="w-4 h-4 text-yellow-600 transition-transform duration-300 group-hover:scale-110" />
                <span className="tracking-normal">Edit PDF</span>
              </span>
            </button>
          </div>
        </>
      )}

      {isEditMode && (
        <PdfEditor
          pdfDataUrl={pdfDataUrl}
          setPdfDataUrl={setPdfDataUrl}
          onCancel={() => setIsEditMode(false)}
        />
      )}
    </div>
  );
};

ResumeGenerator.propTypes = {
  className: PropTypes.string,
  disableDownload: PropTypes.bool,
};

export default ResumeGenerator;
