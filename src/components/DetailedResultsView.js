import React, { useEffect, useState } from "react";
import OneDetailedResult from "./OneDetailedResult";
import axios from "axios";
import { useParams } from "react-router-dom";

function DetailedResultsView() {
  const { studentID, quizID } = useParams();
  const [student, setStudent] = useState({});
  const [quiz, setQuiz] = useState({});

  async function fetchStudent(studentID) {
    try {
      const { data } = await axios.get(`https://sql-autograder-backend.vercel.app/api/students/${studentID}`);
      if (data.success) setStudent(data.response);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchQuiz(quizID) {
    try {
      const { data } = await axios.get(`https://sql-autograder-backend.vercel.app/api/quiz/fetch-one/${quizID}`);
      if (data.success) setQuiz(data.response);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchStudent(studentID);
    fetchQuiz(quizID);
  }, []);

  function calculateTotal(student) {
    let totalMarksAwarded = 0;
    let totalMaxMarks = 0;

    student.forEach((student) => {
      totalMarksAwarded += student.marksAwarded;
      totalMaxMarks += student.maxMarks;
    });

    return totalMarksAwarded + " / " + totalMaxMarks;
  }

  return (
    <div className="bg-[#f7f7f7] px-40 py-28 min-h-screen">
      <section>
        <h1 className="text-3xl">Detailed Results</h1>
        <p className="text-[#5e5e5e]">
          {student.name} - {student.rollNumber}
        </p>
        <p className="text-[#5e5e5e]">
          {quiz.branch} - {quiz.year}
        </p>
        <p className="text-[#5e5e5e] font-bold">Final Score - {student.answers && calculateTotal(student.answers)}</p>
      </section>
      <section>
        {quiz &&
          quiz.questions &&
          quiz.questions.map((question, i) => (
            <OneDetailedResult
              key={i}
              questionNum={i + 1}
              modelQuery={quiz.questions[i]}
              studentQuery={student.answers[i]}
            />
          ))}
      </section>
    </div>
  );
}

export default DetailedResultsView;
