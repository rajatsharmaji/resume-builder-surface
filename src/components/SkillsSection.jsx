import { useState } from "react";

const SkillsSection = () => {
  const [skills, setSkills] = useState("");

  return (
    <div className="border p-4 my-2">
      <label className="block font-medium mb-2">Skills</label>
      <input
        type="text"
        placeholder="Enter skills (comma-separated)"
        className="block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
      />
      <div className="mt-2 text-sm text-gray-600">
        Example: React, JavaScript, Node.js, CSS
      </div>
    </div>
  );
};

export default SkillsSection;
