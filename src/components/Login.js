import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState("students");
  const [teacherDetails, setTeacherDetails] = useState({ email: "", password: "" });
  const [studentDetails, setStudentDetails] = useState({ name: "", rollNumber: "", roomID: "" });

  useEffect(() => {
    if (localStorage.getItem("Token")) navigate("/teacher");
  }, []);

  function handleTogglerClick(e) {
    setActive(e.target.value);
  }

  function handleStudentChange(event) {
    const { name, value } = event.target;
    setStudentDetails((prevStudentDetails) => {
      return {
        ...prevStudentDetails,
        [name]: value,
      };
    });
  }

  function handleTeacherChange(event) {
    const { name, value } = event.target;
    setTeacherDetails((prevTeacherDetails) => {
      return {
        ...prevTeacherDetails,
        [name]: value,
      };
    });
  }

  async function teacherLogin(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post("https://sql-autograder-backend.vercel.app/api/teachers/login", teacherDetails);
      if (data.token) {
        localStorage.setItem("Token", data.token);
        navigate("/teacher");
      }
    } catch (error) {
      console.log(error);
      setError(error.response.data.response);
    } finally {
      setLoading(false);
    }
  }

  async function studentLogin(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        "https://sql-autograder-backend.vercel.app/api/students/register",
        studentDetails
      );
      if (data.success) {
        const { student, quiz } = data;
        if (quiz.open) navigate("/quiz", { state: { student, quiz } });
      } else if (data.response === "Student has already registered for the quiz.") {
        setError("You've already completed this quiz once. You can't retake it.");
      } else {
        setError("The quiz is currently closed for responses. Please try again later.");
      }
    } catch (error) {
      if (error.response.data.response === "Student has already registered for the quiz.") {
        setError("You've already completed this quiz once. You can't retake it.");
      } else {
        setError("The quiz is currently closed for responses. Please try again later.");
      }
      console.log(error.response.data.response);
    }
    setLoading(false);
  }

  function renderButtonContent() {
    if (loading) return <Loader size="20px" white={true} />;
    return active === "students" ? "Join & Begin" : "Login";
  }

  return (
    <div className="p-8 rounded-md bg-white w-1/4 drop-shadow-[0_0_10px_rgba(70,150,255,0.1)]">
      <div className="grid grid-cols-2 gap-4">
        <button
          className={
            active === "students"
              ? "p-2 bg-[#4796ff] rounded hover:cursor-pointer text-[#FFF]"
              : "p-2 rounded hover:cursor-pointer text-[#000]"
          }
          value={"students"}
          onClick={handleTogglerClick}
        >
          Students
        </button>
        <button
          className={
            active === "teachers"
              ? "p-2 bg-[#4796ff] rounded hover:cursor-pointer text-[#FFF]"
              : "p-2 rounded hover:cursor-pointer text-[#000]"
          }
          value={"teachers"}
          onClick={handleTogglerClick}
        >
          Teachers
        </button>
      </div>
      {active === "students" ? (
        // STUDENT LOGIN SCREEN
        <>
          <div className="flex flex-row justify-between mt-8 w-full">
            <input
              type="text"
              name="name"
              className="bg-[#f0f0f0] text-[#5e5e5e] focus:outline-none rounded-lg px-4 py-2 placeholder:italic w-[65%]"
              placeholder="Name"
              value={studentDetails.name}
              onChange={handleStudentChange}
            />
            <input
              type="text"
              name="rollNumber"
              className="bg-[#f0f0f0] text-[#5e5e5e] focus:outline-none rounded-lg px-4 py-2 placeholder:italic w-[30%]"
              placeholder="Roll No."
              value={studentDetails.rollNumber}
              onChange={handleStudentChange}
            />
          </div>
          <input
            type="text"
            name="roomID"
            className="bg-[#f0f0f0] text-[#5e5e5e] focus:outline-none rounded-lg px-4 py-2 placeholder:italic w-full mt-4"
            placeholder="Room ID"
            value={studentDetails.roomID}
            onChange={handleStudentChange}
          />
        </>
      ) : (
        // TEACHER LOGIN SCREEN
        <>
          <input
            type="text"
            name="email"
            className="bg-[#f0f0f0] text-[#5e5e5e] focus:outline-none rounded-lg px-4 py-2 mt-8 placeholder:italic w-full"
            placeholder="Username"
            value={teacherDetails.email}
            onChange={handleTeacherChange}
          />
          <input
            type="password"
            name="password"
            className="bg-[#f0f0f0] text-[#5e5e5e] focus:outline-none rounded-lg px-4 py-2 placeholder:italic w-full mt-4"
            placeholder="Password"
            value={teacherDetails.password}
            onChange={handleTeacherChange}
          />
        </>
      )}

      <button
        type="submit"
        className="p-2 bg-[#4796ff] rounded hover:cursor-pointer text-[#FFF] mt-8 w-full grid grid-cols-1 place-items-center"
        onClick={active === "students" ? studentLogin : teacherLogin}
      >
        {renderButtonContent()}
      </button>
      {error && <p className="text-sm text-[#FF0000] mt-4 text-center">{error}</p>}
    </div>
  );
}

export default Login;
