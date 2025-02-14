export const constructResumePayload = (sectionsData) => {
  const dataArray = Object.keys(sectionsData).map((key) => ({
    id: key,
    ...sectionsData[key],
  }));

  const resume = {};

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

  const aboutSection = dataArray.find((s) => s.type === "about");
  if (aboutSection && aboutSection.content) {
    resume.about = aboutSection.content.about || "";
  }

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

  const currentTemplate = localStorage.getItem("selectedTemplate") || "default";
  resume.template = currentTemplate;

  return resume;
};
