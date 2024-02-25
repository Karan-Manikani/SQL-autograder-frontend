import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function StudentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [student, setStudent] = useState({});

  useEffect(() => {
    if (location.state) {
      const { student } = location.state;
      setStudent(student);
    }
  }, []);
  return (
    <div className="bg-[#f7f7f7] min-h-screen grid grid-cols-1 place-items-center">
      <div className="w-[52%]">
        <h1 className="text-3xl text-center">Submission Recorded ✅</h1>
        <p className="text-[#5e5e5e] mt-2 text-center">
          Congratulations! 🎉 Your quiz has been submitted successfully, and your results are ready.
          <br />
          <span>
            Click{" "}
            <a
              href={`/student/${student._id}/${student.quizID}`}
              className="text-blue-600 underline hover:cursor-pointer"
            >
              here
            </a>{" "}
            to view them.
          </span>
        </p>
      </div>
    </div>
  );
}

export default StudentSuccess;
