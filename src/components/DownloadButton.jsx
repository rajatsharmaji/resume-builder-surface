import PropTypes from "prop-types";

const DownloadButton = ({ children, contentRef }) => {
  function handlePrint() {
    const htmlContent = contentRef.current;
    console.log(htmlContent);
  }

  return (
    <button
      onClick={handlePrint}
      className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
    >
      {children || "Download PDF"}
    </button>
  );
};

DownloadButton.propTypes = {
  children: PropTypes.node,
  contentRef: PropTypes.object.isRequired,
};

export default DownloadButton;
