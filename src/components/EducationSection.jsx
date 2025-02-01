import { useState } from "react";

const EducationSection = () => {
  const [education, setEducation] = useState({
    school: "",
    degree: "",
    year: "",
  });

  return (
    <div className="border p-4 my-2">
      <input
        type="text"
        placeholder="School"
        className="block w-full mb-2"
        value={education.school}
        onChange={(e) => setEducation({ ...education, school: e.target.value })}
      />
      <input
        type="text"
        placeholder="Degree"
        className="block w-full mb-2"
        value={education.degree}
        onChange={(e) => setEducation({ ...education, degree: e.target.value })}
      />
      <input
        type="text"
        placeholder="Year"
        className="block w-full"
        value={education.year}
        onChange={(e) => setEducation({ ...education, year: e.target.value })}
      />
    </div>
  );
};

export default EducationSection;
