import React, { useEffect, useState } from "react";
import QuizSummary from "./QuizSummary";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

function TeacherHomeScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [teacherDetails, setTeacherDetails] = useState({});
  const [quizzes, setQuizzes] = useState([]);

  async function fetchTeacherDetails(token) {
    try {
      const { data } = await axios.get("http://localhost:8081/api/teachers/me", {
        headers: { Authorization: token },
      });
      setTeacherDetails(data.response);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchQuizzes(token) {
    try {
      const { data } = await axios.get("http://localhost:8081/api/quiz/fetch-quizzes", {
        headers: { Authorization: token },
      });

      if (data.success) {
        const tempQuizzes = data.response;

        // Use Promise.all to wait for all promises to resolve
        const newQuizzesPromises = tempQuizzes.map((quiz) => fetchStudentsEnrolled(token, quiz));
        const newQuizzes = await Promise.all(newQuizzesPromises);

        setQuizzes(newQuizzes);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchStudentsEnrolled(token, quiz) {
    let newQuizObj = {};
    try {
      const { data } = await axios.get(
        `http://localhost:8081/api/quiz/fetch-students/${quiz._id}`,
        {
          headers: { Authorization: token },
        }
      );

      if (data.success) newQuizObj = { ...quiz, studentsEnrolled: data.response.length };
    } catch (error) {
      console.log(error);
    }

    return newQuizObj;
  }

  async function deleteQuizFromState(id) {
    const newQuizzes = quizzes.filter((quiz) => quiz.id !== id);
    setQuizzes(newQuizzes);
  }

  useEffect(() => {
    const token = localStorage.getItem("Token");
    if (token) setToken(token);
  }, []);

  useEffect(() => {
    setLoading(true);
    if (token.length !== 0) {
      fetchTeacherDetails(token);
      fetchQuizzes(token);
    }
    setTimeout(() => setLoading(false), 2000);
  }, [token]);

  console.log(quizzes);

  return (
    <>
      {loading ? (
        <Loader center={true} size="8" />
      ) : (
        <>
          {Object.keys(teacherDetails).length !== 0 && (
            <div className="bg-[#f7f7f7] min-h-screen">
              <div className="px-60 py-28">
                <div className="flex justify-between">
                  <h1 className="text-3xl">Welcome, {teacherDetails.name}</h1>
                  <button
                    className="py-2 px-4 bg-[#4796ff] rounded text-[#FFF] w-48"
                    onClick={() => navigate("/teacher/new-quiz")}
                  >
                    New Quiz
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-8 mt-12">
                  {quizzes.map((quiz) => (
                    <QuizSummary
                      quiz={quiz}
                      key={quiz._id}
                      deleteQuizFromState={deleteQuizFromState}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default TeacherHomeScreen;
