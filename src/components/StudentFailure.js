import React from "react";

function StudentFailure() {
  return (
    <div className="bg-[#f7f7f7] min-h-screen grid grid-cols-1 place-items-center">
      <div className="w-[52%]">
        <h1 className="text-3xl text-center">Submission Unsuccessful ❌</h1>
        <p className="text-[#5e5e5e] mt-2 text-center">
          We regret to inform you that your exam submission was not completed due to the expiration
          of the allotted time.
        </p>
      </div>
    </div>
  );
}

export default StudentFailure;
