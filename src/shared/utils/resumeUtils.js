export const constructResumePayload = (sectionsData) => {
  // Ensure sectionsData is not null.
  if (!sectionsData) {
    sectionsData = {};
  }

  // Retrieve the ordered sections array from local storage
  const resumeSections =
    JSON.parse(localStorage.getItem("resumeSections") || "[]") || [];

  // Create an ordered array by merging each section's metadata (id and type)
  // with the corresponding content from sectionsData.
  const dataArray = resumeSections.map((section) => ({
    id: section.id,
    // Use the type from the resumeSections array (ignoring type in sectionsData if it exists)
    type: section.type,
    // Get the content from sectionsData if available, otherwise an empty object.
    content: sectionsData[section.id] ? sectionsData[section.id].content : {},
  }));

  const resume = {};

  // Header Section
  const headerSection = dataArray.find((s) => s.type === "header");
  if (headerSection && headerSection.content) {
    const content = headerSection.content;
    // Use a default empty string for name if null to safely split.
    const names = (content.name || "").split(" ");
    resume.firstName = names[0] || "";
    resume.lastName = names.slice(1).join(" ") || "";
    resume.email = content.email || "";
    resume.phone = content.phone || "";
    resume.linkedinAlias = content.linkedinAlias || "";
    resume.linkedinLink = content.linkedinLink || "";
    resume.githubAlias = content.githubAlias || "";
    resume.githubLink = content.githubLink || "";
  }

  // About Section
  const aboutSection = dataArray.find((s) => s.type === "about");
  if (aboutSection && aboutSection.content) {
    resume.about = aboutSection.content.about || "";
  }

  // Education Section
  const educationSection = dataArray.find((s) => s.type === "education");
  if (
    educationSection &&
    educationSection.content &&
    educationSection.content.education
  ) {
    resume.education = educationSection.content.education.map((edu) => ({
      institution: edu.school || "",
      degree: edu.degree || "",
      graduationDate:
        !edu.isCurrent && edu.endMonth && edu.endYear
          ? `${edu.endMonth} ${edu.endYear}`
          : edu.isCurrent
          ? "Present"
          : "",
      location: edu.location || "",
      gpa: edu.score || "",
    }));
  } else {
    resume.education = [];
  }

  // Experience Section
  const experienceSection = dataArray.find((s) => s.type === "experience");
  if (
    experienceSection &&
    experienceSection.content &&
    experienceSection.content.experience
  ) {
    resume.experience = experienceSection.content.experience.map((exp) => ({
      company: exp.company || "",
      position: exp.role || "",
      startDate:
        exp.startMonth && exp.startYear
          ? `${exp.startMonth} ${exp.startYear}`
          : "",
      endDate: exp.isCurrent
        ? "Present"
        : exp.endMonth && exp.endYear
        ? `${exp.endMonth} ${exp.endYear}`
        : "",
      location: exp.location || "",
      details: exp.description ? [exp.description] : [],
    }));
  } else {
    resume.experience = [];
  }

  // Skills Section
  const skillsSection = dataArray.find((s) => s.type === "skills");
  if (skillsSection && skillsSection.content && skillsSection.content.skills) {
    resume.skills = [
      {
        category: "Technical Skills",
        skills: skillsSection.content.skills,
      },
    ];
  } else {
    resume.skills = [];
  }

  // Projects Section
  const projectsSection = dataArray.find((s) => s.type === "projects");
  if (
    projectsSection &&
    projectsSection.content &&
    projectsSection.content.projects
  ) {
    resume.projects = projectsSection.content.projects.map((proj) => ({
      title: proj.title || "",
      subtitle: "",
      dateRange: "",
      tools: [],
      details: proj.description ? [proj.description] : [],
      link: proj.link || "",
    }));
  } else {
    resume.projects = [];
  }

  // Certifications Section (mapped as awards)
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
        title: cert || "",
        organization: "",
        date: "",
      })
    );
  } else {
    resume.awards = [];
  }

  // Add the currently selected template from local storage.
  const currentTemplate = localStorage.getItem("selectedTemplate") || "default";
  resume.template = currentTemplate;

  return resume;
};
