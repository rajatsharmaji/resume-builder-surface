import PropTypes from "prop-types";

const Loader = ({ size }) => {
  // Define dimensions based on size prop
  let dimension;
  switch (size) {
    case "sm":
      dimension = 16;
      break;
    case "lg":
      dimension = 32;
      break;
    case "md":
    default:
      dimension = 24;
      break;
  }

  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 38 38"
      xmlns="http://www.w3.org/2000/svg"
      stroke="#1D4ED8" // Tailwind CSS blue-500 equivalent
    >
      <g fill="none" fillRule="evenodd">
        <g transform="translate(1 1)" strokeWidth="2">
          <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
          <path d="M36 18c0-9.94-8.06-18-18-18">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 18 18"
              to="360 18 18"
              dur="1s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      </g>
    </svg>
  );
};

Loader.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg"]),
};

Loader.defaultProps = {
  size: "md",
};

export default Loader;
