import axios from "axios";
import React, { useEffect, useState } from "react";
import OneResult from "./OneResult";
import { useParams } from "react-router-dom";

function ViewResults() {
  const { id } = useParams();
  const [students, setStudents] = useState([]);

  async function fetchStudents(quizID) {
    try {
      const { data } = await axios.get(`http://localhost:8081/api/quiz/fetch-students/${quizID}`, {
        headers: { Authorization: localStorage.getItem("Token") },
      });
      setStudents(data.response);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchStudents(id);
  }, []);

  console.log(students);

  return (
    <div className="bg-[#f7f7f7] px-60 py-28 min-h-screen font-[]">
      <h1 className="text-3xl">DBMS Lab Exam Results</h1>
      {/* <h1 className="text-3xl">{quiz && quiz.quizName}</h1> */}
      <p className="text-[#5e5e5e]">
        {/* {quiz && quiz.branch} - {quiz && quiz.year} */}
        B.Tech Computer Science - 2024
      </p>
      {students && students.map((student) => <OneResult key={student._id} student={student} />)}
    </div>
  );
}

export default ViewResults;
