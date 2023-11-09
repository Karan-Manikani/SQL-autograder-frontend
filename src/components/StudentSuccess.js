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
          Congratulations! 🎉 Your exam has been submitted successfully, and your results are ready.
          Click{" "}
          <p
            className="text-blue-600 underline hover:cursor-pointer"
            onClick={() => navigate(`/student/${student._id}/${student.quizID}`)}
          >
            here
          </p>{" "}
          to view them.
        </p>
      </div>
    </div>
  );
}

export default StudentSuccess;
