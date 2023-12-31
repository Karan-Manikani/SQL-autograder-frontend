import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function QuizSummary(props) {
  const [isChecked, setIsChecked] = useState(props.quiz.open);
  const navigate = useNavigate();

  function checkHandler() {
    if (isChecked) closeQuiz();
    else openQuiz();
  }

  async function openQuiz() {
    try {
      const { data } = await axios.patch(
        `http://localhost:8081/api/quiz/open/${props.quiz._id}`,
        {},
        {
          headers: { Authorization: localStorage.getItem("Token") },
        }
      );
      if (data.success) setIsChecked(true);
    } catch (error) {
      console.log(error);
    }
  }

  async function closeQuiz() {
    try {
      const { data } = await axios.patch(
        `http://localhost:8081/api/quiz/close/${props.quiz._id}`,
        {},
        {
          headers: { Authorization: localStorage.getItem("Token") },
        }
      );
      if (data.success) setIsChecked(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteQuiz() {
    try {
      const { data } = await axios.delete(
        `http://localhost:8081/api/quiz/delete/${props.quiz._id}`,
        {
          headers: { Authorization: localStorage.getItem("Token") },
        }
      );
      if (data.success) {
        props.deleteQuizFromState(props.quiz._id);
        window.location.reload(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="w-full bg-white drop-shadow-[0_0_10px_rgba(70,150,255,0.1)] rounded font-thin p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-thin">{props.quiz.quizName}</h2>
        <div className="flex items-center">
          <input
            id="default-checkbox"
            type="checkbox"
            checked={isChecked}
            onChange={checkHandler}
            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded "
          />
          <label
            for="default-checkbox"
            className={`ml-4 text-sm font-thin py-1 px-2 rounded-[96px] ${
              isChecked ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"
            }`}
          >
            {isChecked ? "Open" : "Closed"}
          </label>
        </div>
      </div>
      <div className="text-[#7e7e7e] mt-4">
        <p>{props.quiz.branch}</p>
        <p>Students Enrolled: {props.quiz.studentsEnrolled}</p>
        <p>Room ID: {props.quiz.roomID}</p>
      </div>
      <div className="mt-4 flex justify-between">
        <button
          className="py-2 px-2 bg-[#4796ff] rounded text-[#FFF] w-[45%]"
          onClick={() => navigate(`/results/${props.quiz._id}`)}
        >
          View Results
        </button>
        <button className="py-2 px-4 bg-[#ff4747] rounded text-[#FFF] w-[45%]" onClick={deleteQuiz}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default QuizSummary;
