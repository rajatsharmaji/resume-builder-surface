const TemplatePanel = () => {
  return (
    <div className="w-72 flex flex-col gap-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-screen sticky top-0">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 px-4 pt-4">
          Templates
        </h2>
        <div className="overflow-y-auto flex-1 px-4 pb-4">
          <div className="space-y-2">
            <button className="w-full text-left p-2 rounded hover:bg-gray-50">
              Template 1
            </button>
            <button className="w-full text-left p-2 rounded hover:bg-gray-50">
              Template 2
            </button>
            <button className="w-full text-left p-2 rounded hover:bg-gray-50">
              Template 3
            </button>
            <button className="w-full text-left p-2 rounded hover:bg-gray-50">
              Template 4
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePanel;
