// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ResumeProvider from "./shared/providers/ResumeProvider";
import ResumeBuilder from "./features/builder/ResumeBuilder";
import HashtagAIHomepage from "./features/dashboard/HashtagAIHomepage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HashtagAIHomepage />} />
        <Route
          path="/resume-builder"
          element={
            <ResumeProvider>
              <ResumeBuilder />
            </ResumeProvider>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
