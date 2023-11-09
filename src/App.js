import "./App.css";
import Home from "./components/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import TeacherHomeScreen from "./components/TeacherHomeScreen";
import NewQuiz from "./components/NewQuiz";
import Quiz from "./components/Quiz";
import StudentSuccess from "./components/StudentSuccess";
import Loader from "./components/Loader";
import StudentFailure from "./components/StudentFailure";
import ViewResults from "./components/ViewResults";
import DetailedResultsView from "./components/DetailedResultsView";

function App() {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz/" element={<Quiz />} />
          <Route path="/quiz/successful" element={<StudentSuccess />} />
          <Route path="/quiz/unsuccessful" element={<StudentFailure />} />
          <Route path="/teacher/" element={<TeacherHomeScreen />} />
          <Route path="/teacher/new-quiz" element={<NewQuiz />} />
          <Route path="/results/:id" element={<ViewResults />} />
          <Route path="/student/:studentID/:quizID" element={<DetailedResultsView />} />
          <Route path="/test" element={<Loader />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
