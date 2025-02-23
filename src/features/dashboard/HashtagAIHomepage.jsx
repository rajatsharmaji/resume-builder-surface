import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Header } from "./Header";

const HashtagAIHomepage = () => {
  useEffect(() => {
    document.body.style.background = "#f9fafb";
  }, []);

  return (
    <div className="min-h-screen font-inter antialiased">
      <Helmet>
        <title>HashtagAI - AI-Powered Career & Learning Platform</title>
        <meta
          name="description"
          content="Transform your career trajectory with AI-driven resume optimization and accelerated learning systems."
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <Header />
      {/* Core Features Section */}
      <section className="pt-48 pb-24 bg-white w-full">
        <div className="px-6">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Enterprise-Grade Career Tools
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">
              Powered by advanced AI systems and cognitive science research
            </p>
          </div>
          {features.length === 2 ? (
            <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -10 }}
                  className="p-8 rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-shadow"
                >
                  <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
                    <span className="text-3xl">{feature.icon}</span>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <a
                    href="#"
                    className="text-blue-500 font-medium flex items-center gap-2"
                  >
                    Learn More
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -10 }}
                  className="p-8 rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-shadow"
                >
                  <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
                    <span className="text-3xl">{feature.icon}</span>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <a
                    href="#"
                    className="text-blue-500 font-medium flex items-center gap-2"
                  >
                    Learn More
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="container mx-auto px-6 py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-6">Product</h3>
              <ul className="space-y-4">
                {[
                  "Resume Builder",
                  "Learning Hub",
                  "Career Analytics",
                  "Pricing",
                ].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-6">Company</h3>
              <ul className="space-y-4">
                {["About", "Careers", "Blog", "Contact"].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-6">Resources</h3>
              <ul className="space-y-4">
                {["Help Center", "Documentation", "API Status", "Security"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="hover:text-white transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-6">Stay Updated</h3>
              <div className="space-y-6">
                <p className="text-sm">
                  Subscribe to our newsletter for product updates and career
                  insights.
                </p>
                <div className="flex gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 bg-gray-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg text-sm font-medium transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-20 pt-10 text-center text-gray-500">
            © 2024 HashtagAI.
          </div>
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    icon: "🤖",
    title: "AI Resume Architect",
    description:
      "Context-aware resume builder with real-time ATS optimization and competitive analysis",
  },
  {
    icon: "🧠",
    title: "Cognitive Learning",
    description:
      "Adaptive learning system using Feynman technique and spaced repetition algorithms",
  },
];

export default HashtagAIHomepage;
