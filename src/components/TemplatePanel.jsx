/* eslint-disable react/prop-types */

const TemplatePanel = ({
  applyTemplate,
  customizations,
  updateCustomizations,
}) => {
  const templates = [
    {
      id: "single-column",
      name: "Single Column",
      thumbnail: "https://via.placeholder.com/150?text=Single+Column",
      description: "A simple, linear layout.",
    },
    {
      id: "two-column",
      name: "Two Column",
      thumbnail: "https://via.placeholder.com/150?text=Two+Column",
      description: "A split layout with a sidebar.",
    },
    {
      id: "grid",
      name: "Grid Layout",
      thumbnail: "https://via.placeholder.com/150?text=Grid+Layout",
      description: "A flexible grid-based design.",
    },
  ];

  return (
    <div className="w-72 flex flex-col gap-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-screen sticky top-0">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 px-4 pt-4">
          Resume Templates
        </h2>
        <div className="overflow-y-auto flex-1 px-4 pb-4 space-y-4">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => applyTemplate(template.id)}
              className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                customizations.template === template.id
                  ? "border-2 border-blue-500 bg-blue-50"
                  : "hover:bg-gray-50"
              }`}
            >
              <img
                src={template.thumbnail}
                alt={template.name}
                className="w-full h-32 object-cover rounded-md mb-2"
              />
              <h3 className="text-sm font-medium text-gray-800">
                {template.name}
              </h3>
              <p className="text-xs text-gray-500">{template.description}</p>
            </div>
          ))}
        </div>
        <div className="px-4 pb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Customize</h3>
          <div className="space-y-2">
            <label className="block">
              Font:
              <select
                value={customizations.font}
                onChange={(e) => updateCustomizations("font", e.target.value)}
                className="w-full p-2 rounded border border-gray-300 mt-1"
              >
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Lato">Lato</option>
              </select>
            </label>
            <label className="block">
              Font Size:
              <input
                type="number"
                value={customizations.fontSize.replace("px", "")}
                onChange={(e) =>
                  updateCustomizations("fontSize", `${e.target.value}px`)
                }
                className="w-full p-2 rounded border border-gray-300 mt-1"
              />
            </label>
            <label className="block">
              Primary Color:
              <input
                type="color"
                value={customizations.primaryColor}
                onChange={(e) =>
                  updateCustomizations("primaryColor", e.target.value)
                }
                className="w-full p-2 rounded mt-1"
              />
            </label>
            <label className="block">
              Secondary Color:
              <input
                type="color"
                value={customizations.secondaryColor}
                onChange={(e) =>
                  updateCustomizations("secondaryColor", e.target.value)
                }
                className="w-full p-2 rounded mt-1"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePanel;
