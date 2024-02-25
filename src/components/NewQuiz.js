import React, { useState } from "react";
import readSheetNames from "../utils/parseXLSX";
import Autocomplete from "./Autocomplete";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

function NewQuiz() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [database, setDatabase] = useState({});
  const [keyRelations, setKeyRelations] = useState([{ column1: "", column2: "" }]);
  const [questions, setQuestions] = useState([{ question: "", marks: "" }]);
  const [generalQuizInfo, setGeneralQuizInfo] = useState({
    quizName: "",
    branch: "",
    year: "",
    duration: "",
  });
  const [primaryKeys, setPrimaryKeys] = useState({});
  const [fileName, setFileName] = useState("");

  function displayFileName() {
    const fileInput = document.getElementById("fileInput");
    const fileNameDisplay = document.getElementById("fileName");
    setFileName(fileInput.files[0].name);

    if (fileInput.files.length > 0) {
      fileNameDisplay.textContent = `File: ${fileInput.files[0].name}`;
    } else {
      fileNameDisplay.textContent = "";
    }
  }

  function getDefaultPrimaryKeys(sheetData) {
    const primaryKeys = {};
    Object.keys(sheetData).forEach((tableName) => {
      primaryKeys[tableName] = sheetData[tableName][0];
    });

    return primaryKeys;
  }

  async function parseXLSX(e) {
    const selectedFile = e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;
    const sheetData = await readSheetNames(selectedFile, e);
    setDatabase(sheetData);
    setPrimaryKeys(getDefaultPrimaryKeys(sheetData));
  }

  function handleFileChange(e) {
    displayFileName();
    parseXLSX(e);
  }

  function renderPrimaryKeyDropdown(tableName, columns) {
    return (
      <select
        className="rounded-md ml-2 bg-[#f0f0f0] p-1 text-[#5e5e5e]"
        value={primaryKeys[tableName]}
        onChange={(e) => setPrimaryKeys((prevPrimaryKeys) => ({ ...prevPrimaryKeys, [tableName]: e.target.value }))}
      >
        {columns.map((column) => (
          <option value={column}>{column}</option>
        ))}
      </select>
    );
  }

  function renderDatabase() {
    return Object.keys(database).map((tableName) => {
      const columns = database[tableName];
      return (
        <div className="mb-4">
          <p key={tableName} className="text-[#5e5e5e]">
            {tableName + " ( " + columns.join(", ") + " )"}
          </p>
          <div className="">
            Primary key:
            {renderPrimaryKeyDropdown(tableName, columns)}
          </div>
        </div>
      );
    });
  }

  function addQuestion() {
    const newQuestion = {
      question: "",
      marks: "",
    };

    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
  }

  function deleteQuestion(questionIdx) {
    setQuestions((prevQuestions) => {
      return prevQuestions.filter((question, idx) => idx !== questionIdx);
    });
  }

  function onQuestionChange(index, field, value) {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      const updatedQuestion = { ...updatedQuestions[index], [field]: value };
      updatedQuestions[index] = updatedQuestion;
      return updatedQuestions;
    });
  }

  function handleGeneralQuizInfoChange(event) {
    const { name, value } = event.target;
    setGeneralQuizInfo((prevGeneralQuizInfo) => {
      return {
        ...prevGeneralQuizInfo,
        [name]: value,
      };
    });
  }

  function handleKeyRelationsChange(index, field, value) {
    setKeyRelations((prevKeyRelations) => {
      const updatedRelations = [...prevKeyRelations];
      const updatedRelation = { ...updatedRelations[index], [field]: value };
      updatedRelations[index] = updatedRelation;
      return updatedRelations;
    });
  }

  function addKeyRelation() {
    const newKeyRelation = {
      column1: "",
      column2: "",
    };

    setKeyRelations((prevKeyRelations) => [...prevKeyRelations, newKeyRelation]);
  }

  function deleteKeyRelation(relationIdx) {
    setKeyRelations((prevKeyRelations) => {
      return prevKeyRelations.filter((_, idx) => idx !== relationIdx);
    });
  }

  async function uploadExcelFile(id) {
    try {
      const fileInput = document.getElementById("fileInput");
      const formData = new FormData();
      formData.append("excelFile", fileInput.files[0]);
      formData.append("_id", id);
      formData.append("fileName", fileName);
      const { data } = await axios.post("http://localhost:8081/api/quiz/upload-excel", formData, {
        headers: { Authorization: localStorage.getItem("Token") },
      });
      if (data.success) {
        console.log("STARTED");
        navigate("/teacher");
        setLoading(false);
        const { NoData } = await axios.post(
          `http://localhost:8081/api/quiz/answers/${data.response._id}`,
          {},
          {
            headers: { Authorization: localStorage.getItem("Token") },
          }
        );
        console.log("FINISHED");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSubmit(event) {
    setLoading(true);
    event.preventDefault();
    const quizObject = {
      ...generalQuizInfo,
      keyRelationships: keyRelations,
      questions: questions,
      primaryKeys: primaryKeys,
    };
    try {
      const { data } = await axios.post("http://localhost:8081/api/quiz/create-quiz", quizObject, {
        headers: { Authorization: localStorage.getItem("Token") },
      });
      if (data.success) uploadExcelFile(data.response._id);
    } catch (error) {
      console.log(error);
    }
    // setLoading(false);
  }

  function renderButtonContent() {
    if (loading) return <Loader size="1.5rem" white={true} />;
    return "Create Quiz";
  }

  return (
    <div className="bg-[#f7f7f7] min-h-screen">
      <div className="px-60 py-28">
        <h1 className="text-3xl">New Quiz</h1>
        <h1 className="text-xl mt-8">General Information</h1>
        <div className="grid grid-cols-2 gap-8 ">
          <section>
            <div className="flex justify-between">
              <input
                type="text"
                className="bg-[#f0f0f0] text-[#5e5e5e] focus:outline-none rounded-lg px-4 py-2 placeholder:italic w-[60%] mt-4"
                placeholder="Quiz Name"
                name="quizName"
                onChange={handleGeneralQuizInfoChange}
                value={generalQuizInfo.quizName}
              />
              <input
                type="number"
                className="bg-[#f0f0f0] text-[#5e5e5e] focus:outline-none rounded-lg px-4 py-2 placeholder:italic w-[35%] mt-4"
                placeholder="Duration (min)"
                name="duration"
                onChange={handleGeneralQuizInfoChange}
                value={generalQuizInfo.duration}
              />
            </div>
            <div className="flex justify-between">
              <input
                type="text"
                className="bg-[#f0f0f0] text-[#5e5e5e] focus:outline-none rounded-lg px-4 py-2 placeholder:italic w-[60%] mt-4"
                placeholder="Branch / Class"
                name="branch"
                onChange={handleGeneralQuizInfoChange}
                value={generalQuizInfo.branch}
              />
              <input
                type="text"
                className="bg-[#f0f0f0] text-[#5e5e5e] focus:outline-none rounded-lg px-4 py-2 placeholder:italic w-[35%] mt-4"
                placeholder="Year"
                name="year"
                onChange={handleGeneralQuizInfoChange}
                value={generalQuizInfo.year}
              />
            </div>
          </section>
        </div>

        <section className="mt-8">
          <h1 className="text-xl">Database Upload</h1>
          <div className="mt-4 flex items-center">
            <label htmlFor="fileInput" className="py-2 px-4 bg-[#4796ff] rounded text-[#FFF] cursor-pointer">
              Upload Excel File
            </label>
            <input
              type="file"
              id="fileInput"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              className="hidden"
              onChange={handleFileChange}
            />
            <p id="fileName" className="ml-6 text-[#5e5e5e]"></p>
          </div>
          {Object.keys(database).length !== 0 && (
            <div className="mt-4">
              <p className="text-md font-normal">Found {Object.keys(database).length} tables:</p>
              {renderDatabase()}
            </div>
          )}
        </section>
        <section className="mt-8">
          <div className="flex justify-between items-center">
            <h1 className="text-xl">Key Relationships</h1>
            <button className="py-2 px-4 bg-[#4796ff] rounded text-[#FFF]" onClick={addKeyRelation}>
              Add Relation
            </button>
          </div>
          {keyRelations.map((relation, idx) => {
            return (
              <div className="flex justify-between items-center w-full mt-4" key={idx}>
                <Autocomplete
                  idx={idx}
                  field="column1"
                  database={database}
                  relation={relation.column1}
                  handleKeyRelationsChange={handleKeyRelationsChange}
                />
                <p className="text-[#5e5e5e]">CAN BE JOINED WITH</p>
                <Autocomplete
                  idx={idx}
                  field="column2"
                  database={database}
                  relation={relation.column2}
                  handleKeyRelationsChange={handleKeyRelationsChange}
                />
                {keyRelations.length > 1 && (
                  <span
                    className="material-symbols-outlined cursor-pointer select-none"
                    onClick={() => deleteKeyRelation(idx)}
                  >
                    cancel
                  </span>
                )}
              </div>
            );
          })}
        </section>
        <section className="mt-8">
          <div className="flex justify-between items-center">
            <h1 className="text-xl">Questions</h1>
            <button className="py-2 px-4 bg-[#4796ff] rounded text-[#FFF]" onClick={addQuestion}>
              Add Question
            </button>
          </div>
          {questions.map((question, idx) => {
            return (
              <div className="flex justify-between items-center mt-4" key={idx}>
                <input
                  type="text"
                  className="bg-[#f0f0f0] text-[#5e5e5e] focus:outline-none rounded-lg px-4 py-2 placeholder:italic w-[85%]"
                  placeholder={`Question ${idx + 1}`}
                  onChange={(e) => onQuestionChange(idx, "question", e.target.value)}
                />
                <input
                  type="text"
                  className="bg-[#f0f0f0] text-[#5e5e5e] focus:outline-none rounded-lg px-4 py-2 placeholder:italic w-[10%]"
                  placeholder="Marks"
                  onChange={(e) => onQuestionChange(idx, "marks", e.target.value)}
                />
                {questions.length > 1 && (
                  <span
                    className="material-symbols-outlined cursor-pointer select-none"
                    onClick={() => deleteQuestion(idx)}
                  >
                    cancel
                  </span>
                )}
              </div>
            );
          })}
        </section>
        <div className="grid grid-cols-1 place-items-center">
          <button
            className="mt-8 py-2 px-4 bg-[#4796ff] rounded text-[#FFF] w-1/4 grid place-items-center"
            onClick={handleSubmit}
          >
            {renderButtonContent()}
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewQuiz;
