import { motion } from "framer-motion";
import { Navbar } from "./Navbar";

// Separate Header component that includes the Navbar, hero section, and platform preview.
export const Header = () => {
  return (
    <header className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(#fff 10%, transparent 11%)",
          backgroundSize: "30px 30px",
        }}
      />
      <Navbar />
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-32">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8 inline-flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
              <span className="text-sm">Now in Public Beta</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Next-Generation Career <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Acceleration Platform
              </span>
            </h1>
            <p className="text-base sm:text-xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
              Harness AI-powered tools to craft perfect resumes, master complex
              skills, and accelerate your career growth with data-driven
              insights.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="bg-blue-500 hover:bg-blue-600 px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105">
                Start Free Trial
              </button>
              <button className="border border-white/20 hover:border-white/40 px-8 py-4 rounded-xl font-semibold transition-all">
                Watch Demo
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Platform Preview */}
      <div className="relative -mb-32 mx-auto max-w-7xl px-6">
        <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 p-8 md:border-r md:border-white/10 border-b border-white/10">
              <div className="h-64 sm:h-80 md:h-96 bg-gradient-to-br from-gray-900 to-blue-900 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                <div className="space-y-6">
                  <div className="h-4 bg-white/10 rounded-full w-3/4" />
                  <div className="h-4 bg-white/10 rounded-full w-1/2" />
                  <div className="h-4 bg-white/10 rounded-full w-2/3" />
                </div>
              </div>
            </div>
            <div className="flex-1 p-8">
              <div className="h-64 sm:h-80 md:h-96 bg-gradient-to-br from-purple-900 to-pink-900 rounded-xl p-6">
                <div className="flex flex-col h-full justify-between">
                  <div className="flex justify-between items-center mb-8">
                    <div className="text-xl sm:text-2xl font-bold">
                      Learning Progress
                    </div>
                    <div className="text-sm opacity-75">Quantum Physics</div>
                  </div>
                  <div className="relative">
                    <div className="h-3 bg-white/10 rounded-full mb-4">
                      <div className="w-3/4 h-full bg-blue-400 rounded-full" />
                    </div>
                    <div className="flex justify-between text-sm opacity-75">
                      <span>Current Level</span>
                      <span>Mastery 82%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
