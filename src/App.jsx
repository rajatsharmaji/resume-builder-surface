import ResumeProvider from "/src/providers/ResumeProvider";
import ResumeBuilder from "/src/pages/ResumeBuilder";

function App() {
  return (
    <ResumeProvider>
      <ResumeBuilder />
    </ResumeProvider>
  );
}

export default App;
