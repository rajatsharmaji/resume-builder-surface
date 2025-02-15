// src/components/ExperienceSection.jsx
import { useContext, useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { FiBriefcase, FiEdit2, FiTrash2 } from "react-icons/fi";
import { AiFillThunderbolt } from "react-icons/ai";
import { FaMagic } from "react-icons/fa";
import axios from "axios";
import * as Yup from "yup";
import { ResumeContext } from "../../context/resume-context";
import Loader from "../common/Loader";

const ExperienceSection = ({ sectionId, finalMode = false }) => {
  const { sectionsData, updateSectionContent } = useContext(ResumeContext);

  // Compute and migrate initial experience data
  const initialExperienceData = sectionsData[sectionId]?.content.experience;
  const migrateEntry = useCallback(
    (entry) => ({
      company: entry.company || "",
      role: entry.role || "",
      description: entry.description || "",
      startMonth: entry.startMonth || entry.month || "",
      startYear: entry.startYear || entry.year || "",
      endMonth: entry.endMonth || "",
      endYear: entry.endYear || "",
      isCurrent: entry.isCurrent || false,
    }),
    []
  );

  const computedInitialExperience = useMemo(() => {
    if (Array.isArray(initialExperienceData)) {
      return initialExperienceData.map(migrateEntry);
    } else if (initialExperienceData) {
      return [migrateEntry(initialExperienceData)];
    } else {
      return [
        {
          company: "",
          role: "",
          description: "",
          startMonth: "",
          startYear: "",
          endMonth: "",
          endYear: "",
          isCurrent: false,
        },
      ];
    }
  }, [initialExperienceData, migrateEntry]);

  // Local state for editing experience
  const [experience, setExperience] = useState(computedInitialExperience);
  const [isEditing, setIsEditing] = useState(false);
  const [isFetchingExperience, setIsFetchingExperience] = useState(false);
  const [error, setError] = useState("");
  const [generatingDescIndex, setGeneratingDescIndex] = useState(null);

  // Yup validation schema for each experience entry with custom date order validation
  const experienceEntrySchema = Yup.object()
    .shape({
      company: Yup.string().required("Company is required"),
      role: Yup.string().required("Role is required"),
      description: Yup.string()
        .required("Description is required")
        .min(10, "Description must be at least 10 characters"),
      startMonth: Yup.string().required("Start month is required"),
      startYear: Yup.string()
        .required("Start year is required")
        .matches(/^\d{4}$/, "Start year must be a valid year"),
      isCurrent: Yup.boolean(),
      endMonth: Yup.string().when("isCurrent", (isCurrent, schema) =>
        isCurrent
          ? schema.notRequired()
          : schema.required("End month is required")
      ),
      endYear: Yup.string().when("isCurrent", (isCurrent, schema) =>
        isCurrent
          ? schema.notRequired()
          : schema.required("End year is required")
      ),
    })
    .test(
      "start-end-order",
      "Start date must be earlier than end date",
      function (value) {
        const { startYear, startMonth, endYear, endMonth, isCurrent } = value;
        if (isCurrent) return true; // No end date validation if currently working.
        if (!startYear || !startMonth || !endYear || !endMonth) return true;
        const monthMapping = {
          January: 1,
          February: 2,
          March: 3,
          April: 4,
          May: 5,
          June: 6,
          July: 7,
          August: 8,
          September: 9,
          October: 10,
          November: 11,
          December: 12,
        };
        const sYear = parseInt(startYear, 10);
        const eYear = parseInt(endYear, 10);
        const sMonth = monthMapping[startMonth] || 0;
        const eMonth = monthMapping[endMonth] || 0;
        if (sYear < eYear || (sYear === eYear && sMonth < eMonth)) {
          return true;
        }
        return false;
      }
    );

  const experienceSchema = Yup.array().of(experienceEntrySchema);

  // Static suggestions and date arrays
  const companySuggestions = useMemo(
    () => ["Google", "Facebook", "Amazon", "Microsoft", "Apple", "Netflix"],
    []
  );

  const roleSuggestions = useMemo(
    () => [
      "Software Engineer",
      "Frontend Developer",
      "Backend Developer",
      "DevOps Engineer",
      "Product Manager",
      "UI/UX Designer",
    ],
    []
  );

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yrs = [];
    for (let y = currentYear; y >= 1980; y--) {
      yrs.push(y);
    }
    return yrs;
  }, []);

  const months = useMemo(
    () => [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    []
  );

  // Handlers
  const handleEntryChange = useCallback((index, field, value) => {
    setExperience((prev) => {
      const newExperience = [...prev];
      newExperience[index] = { ...newExperience[index], [field]: value };

      // Clear end dates if "currently working here" is checked.
      if (field === "isCurrent" && value) {
        newExperience[index].endMonth = "";
        newExperience[index].endYear = "";
      }
      return newExperience;
    });
  }, []);

  // Save local changes to context after validating with Yup
  const handleSave = useCallback(() => {
    experienceSchema
      .validate(experience, { abortEarly: false })
      .then(() => {
        updateSectionContent(sectionId, { experience });
        setIsEditing(false);
        setError("");
      })
      .catch((validationError) => {
        if (validationError.inner && validationError.inner.length > 0) {
          // Only take the first error message.
          setError(validationError.inner[0].message);
        } else {
          setError(validationError.message);
        }
      });
  }, [experience, experienceSchema, updateSectionContent, sectionId]);

  const handleAddMore = useCallback(() => {
    if (experience.length >= 3) {
      setError("Maximum of three experiences allowed");
      return;
    }
    setError("");
    setExperience((prev) => [
      ...prev,
      {
        company: "",
        role: "",
        description: "",
        startMonth: "",
        startYear: "",
        endMonth: "",
        endYear: "",
        isCurrent: false,
      },
    ]);
  }, [experience]);

  const handleRemoveExperience = useCallback((index, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setExperience((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Simulated API call to fetch experience data (triggered on drag start)
  const fetchExperienceData = useCallback(async () => {
    try {
      setIsFetchingExperience(true);
      setError("");
      const response = await new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              data: {
                experience: [
                  {
                    company: "Amazon",
                    role: "DevOps Engineer",
                    description:
                      "Managed cloud infrastructure and automated deployment pipelines.",
                    startYear: "2020",
                    startMonth: "June",
                    endMonth: "",
                    endYear: "",
                    isCurrent: true,
                  },
                ],
              },
            }),
          1500
        )
      );
      // Update both local and context data immediately.
      setExperience(response.data.experience);
      updateSectionContent(sectionId, {
        experience: response.data.experience,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to fetch experience data. Please try again.");
    } finally {
      setIsFetchingExperience(false);
    }
  }, [updateSectionContent, sectionId]);

  // Insert a sample description without immediately updating context.
  const handleSampleDesc = useCallback((index, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const sampleDesc =
      "Developed innovative solutions and improved system performance.";
    setExperience((prev) => {
      const newExp = [...prev];
      newExp[index] = { ...newExp[index], description: sampleDesc };
      return newExp;
    });
  }, []);

  // Call AI to enhance the description; update local state only.
  const handleAIDesc = useCallback(
    async (index, e) => {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      try {
        setGeneratingDescIndex(index);
        setError("");
        const response = await axios.post(
          "http://localhost:3008/api/v1/ai/experience-description",
          {
            text: experience[index].description,
          }
        );
        setExperience((prev) => {
          const newExp = [...prev];
          newExp[index] = {
            ...newExp[index],
            description: response.data.result,
          };
          return newExp;
        });
      } catch (err) {
        console.error(err);
        setError("Failed to enhance description. Please try again.");
      } finally {
        setGeneratingDescIndex(null);
      }
    },
    [experience]
  );

  // Final (read-only) mode view.
  if (finalMode) {
    return (
      <div className="mb-6 p-6 bg-white shadow rounded">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Work Experience
        </h3>
        {experience.map((entry, index) => (
          <div key={index} className="mb-6 border-b pb-4">
            <p className="text-gray-700">
              <strong>Company:</strong> {entry.company || "N/A"}
            </p>
            <p className="text-gray-700">
              <strong>Role:</strong> {entry.role || "N/A"}
            </p>
            <p className="text-gray-700">
              <strong>Duration:</strong>{" "}
              {entry.startMonth && entry.startYear
                ? `${entry.startMonth} ${entry.startYear} - ${
                    entry.isCurrent
                      ? "Present"
                      : entry.endMonth && entry.endYear
                      ? `${entry.endMonth} ${entry.endYear}`
                      : "N/A"
                  }`
                : "N/A"}
            </p>
            <p className="text-gray-700">
              <strong>Description:</strong> {entry.description || "N/A"}
            </p>
          </div>
        ))}
      </div>
    );
  }

  // Editable mode view.
  return (
    <div
      className="relative group border-l-4 border-blue-500 bg-white shadow-lg rounded-lg p-8 mb-6 transition-transform duration-200 hover:scale-105"
      draggable={!isEditing}
      onDragStart={!isEditing ? fetchExperienceData : undefined}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <FiBriefcase className="w-7 h-7 text-blue-500" />
          <h3 className="text-2xl font-semibold text-gray-800">
            Work Experience
          </h3>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <FiEdit2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      {isFetchingExperience && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">
          <Loader size="lg" />
        </div>
      )}

      {isEditing ? (
        <div className="relative space-y-8">
          {experience.map((entry, index) => (
            <div key={index} className="mb-8 border-b pb-4 relative">
              {/* Remove Experience Icon */}
              {experience.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => handleRemoveExperience(index, e)}
                  className="absolute top-0 right-0 p-2 text-red-500 hover:text-red-700 transition-colors"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              )}

              {/* Company Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your company name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                  value={entry.company}
                  onChange={(e) =>
                    handleEntryChange(index, "company", e.target.value)
                  }
                  list={`company-suggestions-${index}`}
                />
                <datalist id={`company-suggestions-${index}`}>
                  {companySuggestions.map((company, i) => (
                    <option key={i} value={company} />
                  ))}
                </datalist>
              </div>

              {/* Role Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  placeholder="Enter your role"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                  value={entry.role}
                  onChange={(e) =>
                    handleEntryChange(index, "role", e.target.value)
                  }
                  list={`role-suggestions-${index}`}
                />
                <datalist id={`role-suggestions-${index}`}>
                  {roleSuggestions.map((role, i) => (
                    <option key={i} value={role} />
                  ))}
                </datalist>
              </div>

              {/* Start Date Fields */}
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Start Month
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                    value={entry.startMonth}
                    onChange={(e) =>
                      handleEntryChange(index, "startMonth", e.target.value)
                    }
                  >
                    <option value="">Select Month</option>
                    {months.map((mon, i) => (
                      <option key={i} value={mon}>
                        {mon}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Start Year
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                    value={entry.startYear}
                    onChange={(e) =>
                      handleEntryChange(index, "startYear", e.target.value)
                    }
                  >
                    <option value="">Select Year</option>
                    {years.map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Conditionally Render End Date Fields */}
              {!entry.isCurrent && (
                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      End Month
                    </label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                      value={entry.endMonth}
                      onChange={(e) =>
                        handleEntryChange(index, "endMonth", e.target.value)
                      }
                    >
                      <option value="">Select Month</option>
                      {months.map((mon, i) => (
                        <option key={i} value={mon}>
                          {mon}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      End Year
                    </label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                      value={entry.endYear}
                      onChange={(e) =>
                        handleEntryChange(index, "endYear", e.target.value)
                      }
                    >
                      <option value="">Select Year</option>
                      {years.map((yr) => (
                        <option key={yr} value={yr}>
                          {yr}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Currently Working Here Checkbox */}
              <div className="mb-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={entry.isCurrent}
                    onChange={(e) =>
                      handleEntryChange(index, "isCurrent", e.target.checked)
                    }
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Currently working here
                  </span>
                </label>
              </div>

              {/* Description Field with Sample & AI Enhance Buttons */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Describe your responsibilities and achievements..."
                  className="w-full h-32 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 resize-none"
                  value={entry.description}
                  onChange={(e) =>
                    handleEntryChange(index, "description", e.target.value)
                  }
                ></textarea>
                <div className="flex gap-3 mt-3">
                  <button
                    type="button"
                    onClick={(e) => handleSampleDesc(index, e)}
                    className="flex items-center gap-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md shadow-sm hover:bg-gray-300 transition-colors text-sm"
                  >
                    <FaMagic />
                    <span>Sample</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleAIDesc(index, e)}
                    disabled={generatingDescIndex === index}
                    className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 transition-colors text-sm disabled:opacity-50"
                  >
                    {generatingDescIndex === index ? (
                      <Loader size="sm" />
                    ) : (
                      <>
                        <AiFillThunderbolt />
                        <span>AI Enhance</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Error Message above the Save button */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded shadow">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleSave}
              className="mt-3 px-6 py-3 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleAddMore}
              className="mt-3 px-6 py-3 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition-colors"
            >
              Add More
            </button>
          </div>
        </div>
      ) : (
        // Preview view (click to edit)
        <div
          className="cursor-text"
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
        >
          {experience.map((entry, index) => (
            <div key={index} className="mb-6">
              <p className="text-gray-700">
                <strong>Company:</strong>{" "}
                {entry.company || "Click to add company name"}
              </p>
              <p className="text-gray-700">
                <strong>Role:</strong> {entry.role || "Click to add your role"}
              </p>
              <p className="text-gray-700">
                <strong>Duration:</strong>{" "}
                {entry.startMonth && entry.startYear
                  ? `${entry.startMonth} ${entry.startYear} - ${
                      entry.isCurrent
                        ? "Present"
                        : entry.endMonth && entry.endYear
                        ? `${entry.endMonth} ${entry.endYear}`
                        : "N/A"
                    }`
                  : "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Description:</strong>{" "}
                {entry.description || "Click to add description"}
              </p>
            </div>
          ))}
          <div className="mt-2 text-sm text-gray-400">
            Click to edit – Drag to auto-fill experience data available
          </div>
        </div>
      )}
    </div>
  );
};

ExperienceSection.propTypes = {
  sectionId: PropTypes.number.isRequired,
  finalMode: PropTypes.bool,
};

export default ExperienceSection;
