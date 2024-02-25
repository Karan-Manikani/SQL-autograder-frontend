import React, { useEffect, useState } from "react";

function StudentFailure() {
  return (
    <div className="bg-[#f7f7f7] min-h-screen grid grid-cols-1 place-items-center">
      <div className="w-[52%]">
        <h1 className="text-3xl text-center">Submission Unsuccessful ❌</h1>
        <p className="text-[#5e5e5e] mt-2 text-center">
          Your quiz submission wasn't completed because either the allotted time expired or you've already submitted
          your answers.
        </p>
      </div>
    </div>
  );
}

export default StudentFailure;
