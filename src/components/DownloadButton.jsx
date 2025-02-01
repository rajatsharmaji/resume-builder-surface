// import { useReactToPrint } from "react-to-print";
import PropTypes from "prop-types";
import { convertHtmlToLatex } from "../resume-templates/convertHtmlToLatex";
import LatexPreviewer from "./LatexPreviewer";
import { useState } from "react";

const DownloadButton = ({ children, contentRef }) => {
  // const handlePrint = useReactToPrint({
  //   content: () => contentRef.current, // Always return the ref’s current element
  //   documentTitle: "my-resume",
  //   removeAfterPrint: true,
  //   onBeforeGetContent: () => {
  //     document.body.classList.add("printing");
  //   },
  //   onAfterPrint: () => {
  //     document.body.classList.remove("printing");
  //   },
  // });

  const [latexCode, setLatexCode] = useState("");

  const handlePrint = () => {
    const htmlContent = contentRef.current;
    const generatedLatex = convertHtmlToLatex(htmlContent);
    setLatexCode(generatedLatex);
  };

  // return (
  //   <button
  //     onClick={handlePrint}
  //     className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
  //   >
  //     {children || "Download PDF"}
  //   </button>
  // );

  return (
    <div>
      <div id="resume-source" style={{ display: "none" }}>
        {/* The HTML content that will be converted. It could be hidden from the user. */}
        <div className="bg-white shadow-md p-6 rounded">
          {/* ... Other content ... */}
        </div>
        <div className="border p-4 my-2">
          <label className="block font-medium mb-2">About Me</label>
          <textarea
            placeholder="Write a brief description about yourself..."
            className="block w-full h-24 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            This is my about section.
          </textarea>
          <div className="mt-2 text-sm text-gray-600">
            Highlight your key strengths, goals, or professional background.
          </div>
        </div>
        <input
          type="text"
          placeholder="School"
          className="block w-full mb-2"
          value="My University"
        />
        <input
          type="text"
          placeholder="Degree"
          className="block w-full mb-2"
          value="Bachelor of Science"
        />
        <input
          type="text"
          placeholder="Year"
          className="block w-full"
          value="2024"
        />
      </div>

      <button onClick={handlePrint}>Generate LaTeX Resume</button>

      {latexCode && <LatexPreviewer latexCode={latexCode} />}
    </div>
  );
};

DownloadButton.propTypes = {
  children: PropTypes.node,
  contentRef: PropTypes.object.isRequired,
};

export default DownloadButton;
