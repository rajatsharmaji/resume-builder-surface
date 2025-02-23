// Separate Navbar component
export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-6 py-4 flex flex-wrap justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            #HashtagAI
          </span>
        </h1>
        <div className="flex gap-8 items-center">
          {["Product", "Solutions", "Resources"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm font-medium hover:text-blue-300 transition-colors"
            >
              {item}
            </a>
          ))}
          <a
            href="/resume-builder"
            className="text-sm font-medium hover:text-blue-300 transition-colors"
          >
            Resume Builder
          </a>
          <button className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-full text-sm font-semibold transition-all">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};
