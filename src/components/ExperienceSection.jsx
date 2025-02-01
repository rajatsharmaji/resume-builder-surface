import { useState } from "react";

const ExperienceSection = () => {
  const [experience, setExperience] = useState({
    company: "",
    role: "",
    description: "",
  });

  return (
    <div className="border p-4 my-2">
      <label className="block font-medium mb-2">Work Experience</label>
      <input
        type="text"
        placeholder="Company Name"
        className="block w-full mb-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
        value={experience.company}
        onChange={(e) =>
          setExperience({ ...experience, company: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Role"
        className="block w-full mb-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
        value={experience.role}
        onChange={(e) => setExperience({ ...experience, role: e.target.value })}
      />
      <textarea
        placeholder="Description of your role and responsibilities..."
        className="block w-full h-24 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
        value={experience.description}
        onChange={(e) =>
          setExperience({ ...experience, description: e.target.value })
        }
      ></textarea>
    </div>
  );
};

export default ExperienceSection;
