import ResumeProvider from "./providers/ResumeProvider";
import ResumeBuilder from "./pages/ResumeBuilder";

function App() {
  return (
    <ResumeProvider>
      <ResumeBuilder />
    </ResumeProvider>
  );
}

export default App;
