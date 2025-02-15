// src/components/EducationSection.jsx
import { useContext, useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { FiBook, FiEdit2, FiTrash2 } from "react-icons/fi";
import * as Yup from "yup";
import { ResumeContext } from "../../context/resume-context";
import Loader from "../common/Loader";
import ConfirmationModal from "../common/ConfirmationModal";

const EducationSection = ({ sectionId, finalMode = false }) => {
  const { sectionsData, updateSectionContent } = useContext(ResumeContext);

  // Compute initial education data.
  const initialEducation = sectionsData[sectionId]?.content.education;
  const computedInitialEducation = Array.isArray(initialEducation)
    ? initialEducation
    : initialEducation
    ? [initialEducation]
    : [
        {
          school: "",
          degree: "",
          startMonth: "",
          startYear: "",
          isCurrent: false,
          endMonth: "",
          endYear: "",
          score: "",
          scoreType: "",
        },
      ];

  // Local state.
  const [education, setEducation] = useState(computedInitialEducation);
  const [isEditing, setIsEditing] = useState(false);
  const [isFetchingCollege, setIsFetchingCollege] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Suggestions for school and degree.
  const schoolSuggestions = useMemo(
    () => [
      "Harvard University",
      "Stanford University",
      "MIT",
      "Yale University",
      "Princeton University",
      "Oxford University",
      "Cambridge University",
    ],
    []
  );
  const degreeSuggestions = useMemo(
    () => [
      "B.Sc. in Computer Science",
      "B.A. in Economics",
      "MBA",
      "B.Sc. in Engineering",
      "Ph.D. in Physics",
      "M.Sc. in Data Science",
    ],
    []
  );

  // Dropdown options for months.
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

  // Dropdown options for years.
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yrs = [];
    for (let y = currentYear; y >= 1980; y--) {
      yrs.push(String(y));
    }
    return yrs;
  }, []);

  // Yup validation schema for each education entry.
  const educationEntrySchema = Yup.object()
    .shape({
      school: Yup.string().required("School is required"),
      degree: Yup.string().required("Degree is required"),
      startMonth: Yup.string().required("Start month is required"),
      startYear: Yup.string()
        .required("Start year is required")
        .matches(/^\d{4}$/, "Start year must be a valid 4-digit year"),
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
      score: Yup.string().required("Score is required"),
      scoreType: Yup.string().required("Score type is required"),
    })
    .test(
      "start-end-order",
      "Start date must be earlier than end date",
      function (value) {
        const { startYear, startMonth, endYear, endMonth, isCurrent } = value;
        if (isCurrent) return true; // No end date validation if currently studying.
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
        return sYear < eYear || (sYear === eYear && sMonth < eMonth);
      }
    );
  const educationSchema = Yup.array().of(educationEntrySchema);

  // Handle changes for a specific education entry.
  const handleEntryChange = useCallback((index, field, value) => {
    setEducation((prev) => {
      const newEntries = [...prev];
      newEntries[index] = { ...newEntries[index], [field]: value };
      return newEntries;
    });
  }, []);

  // Remove an education entry.
  const handleRemoveEntry = useCallback((index, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setEducation((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Save updates after validating with Yup.
  const handleSave = useCallback(() => {
    educationSchema
      .validate(education, { abortEarly: false })
      .then(() => {
        updateSectionContent(sectionId, { education });
        setIsEditing(false);
        setError("");
      })
      .catch((validationError) => {
        if (validationError.inner && validationError.inner.length > 0) {
          setError(validationError.inner[0].message);
        } else {
          setError(validationError.message);
        }
      });
  }, [education, educationSchema, updateSectionContent, sectionId]);

  // Add a new education entry (maximum of three allowed).
  const handleAddMore = useCallback(() => {
    if (education.length >= 3) {
      setError("Maximum of three education entries allowed");
      return;
    }
    setError("");
    setEducation((prev) => [
      ...prev,
      {
        school: "",
        degree: "",
        startMonth: "",
        startYear: "",
        isCurrent: false,
        endMonth: "",
        endYear: "",
        score: "",
        scoreType: "",
      },
    ]);
  }, [education]);

  // Simulated API call to fetch college data when dragging the component.
  const fetchCollegeData = async () => {
    try {
      setIsFetchingCollege(true);
      setError("");
      // Simulated API call (replace with your real endpoint)
      const response = await new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              data: {
                education: [
                  {
                    school: "Stanford University",
                    degree: "B.Sc. in Computer Science",
                    startMonth: "September",
                    startYear: "2014",
                    isCurrent: false,
                    endMonth: "June",
                    endYear: "2018",
                    score: "3.8",
                    scoreType: "GPA",
                  },
                ],
              },
            }),
          1500
        )
      );
      setEducation(response.data.education);
      updateSectionContent(sectionId, { education: response.data.education });
    } catch (err) {
      console.error(err);
      setError("Failed to fetch college data. Please try again.");
    } finally {
      setIsFetchingCollege(false);
    }
  };

  // Handle drag-to-auto-fill with confirmation modal.
  const handleDragStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirmation(true);
  };

  const confirmAutoFill = () => {
    setShowConfirmation(false);
    fetchCollegeData();
  };

  const cancelAutoFill = () => {
    setShowConfirmation(false);
  };

  // Final (read-only) mode view.
  if (finalMode) {
    return (
      <div className="mb-6 p-6 bg-white shadow rounded">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Education</h3>
        {education.map((entry, index) => (
          <div key={index} className="mb-6 border-b pb-4">
            <p className="text-gray-700">
              <strong>School:</strong> {entry.school || "N/A"}
            </p>
            <p className="text-gray-700">
              <strong>Degree:</strong> {entry.degree || "N/A"}
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
              <strong>Score:</strong>{" "}
              {entry.score && entry.scoreType
                ? `${entry.score} (${entry.scoreType})`
                : "N/A"}
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
      onDragStart={!isEditing ? handleDragStart : undefined}
    >
      {isFetchingCollege && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">
          <Loader size="lg" />
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <FiBook className="w-7 h-7 text-blue-500" />
          <h3 className="text-2xl font-semibold text-gray-800">Education</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiEdit2 className="w-7 h-7" />
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="relative space-y-8">
          {education.map((entry, index) => (
            <div key={index} className="mb-8 border-b pb-4 relative">
              {education.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => handleRemoveEntry(index, e)}
                  className="absolute top-0 right-0 p-2 text-red-500 hover:text-red-700 transition-colors"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              )}
              {/* School Field */}
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  School
                </label>
                <input
                  type="text"
                  placeholder="Enter your school name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                  value={entry.school}
                  onChange={(e) =>
                    handleEntryChange(index, "school", e.target.value)
                  }
                  list={`school-suggestions-${index}`}
                />
                <datalist id={`school-suggestions-${index}`}>
                  {schoolSuggestions.map((school, i) => (
                    <option key={i} value={school} />
                  ))}
                </datalist>
              </div>
              {/* Degree Field */}
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Degree / Course
                </label>
                <input
                  type="text"
                  placeholder="Enter your degree or course"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                  value={entry.degree}
                  onChange={(e) =>
                    handleEntryChange(index, "degree", e.target.value)
                  }
                  list={`degree-suggestions-${index}`}
                />
                <datalist id={`degree-suggestions-${index}`}>
                  {degreeSuggestions.map((degree, i) => (
                    <option key={i} value={degree} />
                  ))}
                </datalist>
              </div>
              {/* Start Date */}
              <div className="mb-2 grid grid-cols-2 gap-4">
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
                    {years.map((yr, i) => (
                      <option key={i} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Currently Studying Checkbox */}
              <div className="mb-2">
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
                    Currently Studying
                  </span>
                </label>
              </div>
              {/* End Date (if not currently studying) */}
              {!entry.isCurrent && (
                <div className="mb-2 grid grid-cols-2 gap-4">
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
                      {years.map((yr, i) => (
                        <option key={i} value={yr}>
                          {yr}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              {/* Score Field */}
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Score
                </label>
                <input
                  type="text"
                  placeholder="Enter your score"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                  value={entry.score}
                  onChange={(e) =>
                    handleEntryChange(index, "score", e.target.value)
                  }
                />
              </div>
              {/* Score Type Dropdown */}
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Score Type
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                  value={entry.scoreType}
                  onChange={(e) =>
                    handleEntryChange(index, "scoreType", e.target.value)
                  }
                >
                  <option value="">Select Score Type</option>
                  <option value="CGPA">CGPA</option>
                  <option value="GPA">GPA</option>
                  <option value="Percentage">Percentage</option>
                </select>
              </div>
            </div>
          ))}

          {/* Error Message above the action buttons */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded shadow">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="mt-3 px-6 py-3 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={handleAddMore}
              className="mt-3 px-6 py-3 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition-colors"
            >
              Add More
            </button>
          </div>
        </div>
      ) : (
        // Preview Mode
        <div className="cursor-text" onClick={() => setIsEditing(true)}>
          {education.map((entry, index) => (
            <div key={index} className="mb-4">
              <p className="text-gray-700">
                <strong>School:</strong>{" "}
                {entry.school || "Click to add your school name"}
              </p>
              <p className="text-gray-700">
                <strong>Degree:</strong>{" "}
                {entry.degree || "Click to add your degree or course"}
              </p>
              <p className="text-gray-700">
                <strong>Duration:</strong>{" "}
                {entry.startMonth && entry.startYear
                  ? `${entry.startMonth} ${entry.startYear} - ${
                      entry.isCurrent
                        ? "Present"
                        : entry.endMonth && entry.endYear
                        ? `${entry.endMonth} ${entry.endYear}`
                        : "Click to add your study duration"
                    }`
                  : "Click to add your study duration"}
              </p>
              <p className="text-gray-700">
                <strong>Score:</strong>{" "}
                {entry.score && entry.scoreType
                  ? `${entry.score} (${entry.scoreType})`
                  : "Click to add your score"}
              </p>
            </div>
          ))}
          <div className="mt-2 text-sm text-gray-400">
            Click to edit – Drag to auto-fill sample data
          </div>
        </div>
      )}

      {/* Global confirmation modal rendered via portal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        message="This will replace all previous data with sample data. Do you want to proceed?"
        onConfirm={confirmAutoFill}
        onCancel={cancelAutoFill}
      />
    </div>
  );
};

EducationSection.propTypes = {
  sectionId: PropTypes.number.isRequired,
  finalMode: PropTypes.bool,
};

export default EducationSection;
