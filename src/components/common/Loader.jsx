import PropTypes from "prop-types";

const Loader = ({ size = "md" }) => {
  // Determine the overall dimensions based on the provided size prop.
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
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Lightning bolt shape */}
      <path
        d="M7 2v11h3v9l7-12h-4l4-8z"
        fill="#1D4ED8" // Tailwind blue-500 equivalent
      >
        {/* Animate opacity to create a flicker effect */}
        <animate
          attributeName="opacity"
          values="0.2;1;0.2"
          dur="0.8s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
};

Loader.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg"]),
};

export default Loader;
