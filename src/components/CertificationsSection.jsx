/* eslint-disable react/prop-types */
// src/components/CertificationsSection.jsx
import { useContext } from "react";
import { ResumeContext } from "../context/resume-context";

const CertificationsSection = ({ sectionId }) => {
  const { sectionsData, updateSectionContent } = useContext(ResumeContext);
  const certifications = sectionsData[sectionId]?.content.certifications || "";

  return (
    <div className="border p-4 my-2">
      <label className="block font-medium mb-2">Certifications</label>
      <input
        type="text"
        placeholder="Enter certifications (comma-separated)"
        className="block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
        value={certifications}
        onChange={(e) =>
          updateSectionContent(sectionId, { certifications: e.target.value })
        }
      />
      <div className="mt-2 text-sm text-gray-600">
        Example: AWS Certified Developer, PMP, Scrum Master
      </div>
    </div>
  );
};

export default CertificationsSection;
