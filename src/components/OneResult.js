import React from "react";
import { useNavigate } from "react-router-dom";

function OneResult(props) {
  const naviagte = useNavigate();
  function calculateTotal(student) {
    let totalMarksAwarded = 0;
    let totalMaxMarks = 0;

    student.forEach((student) => {
      totalMarksAwarded += student.marksAwarded;
      totalMaxMarks += student.maxMarks;
    });

    return totalMarksAwarded + "/" + totalMaxMarks;
  }

  return (
    <div className="flex justify-between p-4 bg-white rounded text-[#5e5e5e] drop-shadow-[0_0_10px_rgba(70,150,255,0.1)] font-thin items-center mt-8">
      <div>
        <p>
          {props.student.name} - {props.student.rollNumber}
        </p>
        <p>
          <b className="font-medium">Score:</b> {calculateTotal(props.student.answers)}
        </p>
      </div>
      <div>
        <button
          className="py-2 px-2 bg-[#4796ff] rounded text-[#FFF] "
          onClick={() => naviagte(`/student/${props.student._id}/${props.student.quizID}`)}
        >
          Detailed View
        </button>
      </div>
    </div>
  );
}

export default OneResult;
