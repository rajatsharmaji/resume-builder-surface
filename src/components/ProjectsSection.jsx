import { useState } from "react";

const ProjectsSection = () => {
  const [project, setProject] = useState({
    title: "",
    description: "",
    link: "",
  });

  return (
    <div className="border p-4 my-2">
      <label className="block font-medium mb-2">Projects</label>
      <input
        type="text"
        placeholder="Project Title"
        className="block w-full mb-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
        value={project.title}
        onChange={(e) => setProject({ ...project, title: e.target.value })}
      />
      <textarea
        placeholder="Project Description"
        className="block w-full h-24 mb-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
        value={project.description}
        onChange={(e) =>
          setProject({ ...project, description: e.target.value })
        }
      ></textarea>
      <input
        type="url"
        placeholder="Project Link (optional)"
        className="block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
        value={project.link}
        onChange={(e) => setProject({ ...project, link: e.target.value })}
      />
    </div>
  );
};

export default ProjectsSection;
