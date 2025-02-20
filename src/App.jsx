import ResumeProvider from "./shared/providers/ResumeProvider";
import ResumeBuilder from "./features/builder/ResumeBuilder";

function App() {
  return (
    <ResumeProvider>
      <ResumeBuilder />
    </ResumeProvider>
  );
}

export default App;
