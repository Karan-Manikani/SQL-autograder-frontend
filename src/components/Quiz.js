import React, { useEffect, useState } from "react";
import { CodeBlock, monoBlue } from "react-code-blocks";
import Question from "./Question";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";

function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [schema, setSchema] = useState(null);
  const [answers, setAnswers] = useState({});
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timer;

    if (minutes === 0 && seconds === 0) {
      handleSubmit();
    } else {
      // Decrease the timer every second
      timer = setInterval(() => {
        if (seconds === 0) {
          setMinutes((prevMinutes) => prevMinutes - 1);
          setSeconds(59);
        } else {
          setSeconds((prevSeconds) => prevSeconds - 1);
        }
      }, 1000);
    }

    // Cleanup the interval on component unmount
    return () => clearInterval(timer);
  }, [minutes, seconds]);

  function handleCodeChange(query, answer) {
    setAnswers((prevAnswers) => {
      return { ...prevAnswers, [answer]: query };
    });
  }

  function formSQLDatabaseSchema(databaseSchema, keyRelationships, primaryKeys) {
    let tableStatements = "";
    let referenceStatements = "";

    databaseSchema.forEach((table) => {
      const tableName = table.tableName;
      const columns = table.columns;
      const dtypes = table.dtypes;

      // Generate SQL statement for the table
      tableStatements += `TABLE ${tableName}\n`;

      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        const dtype = dtypes[i];
        const primaryKey = primaryKeys[tableName] === column ? " PRIMARY KEY" : "";

        tableStatements += `  ${column} ${dtype}${primaryKey}\n`;
      }

      tableStatements += "\n";
    });

    keyRelationships.forEach((relation) => {
      const { column1, column2 } = relation;
      const reference = column1 + " REFERENCES " + column2 + "\n";
      referenceStatements += reference;
    });

    return `${tableStatements}${referenceStatements.trim()}`;
  }

  function initializeAnswers(numQuestions) {
    const answersObj = {};
    for (let i = 1; i < numQuestions + 1; i++) {
      const element = "answer" + i;
      answersObj[element] = "";
    }
    return answersObj;
  }

  async function handleSubmit() {
    setIsLoading(true);
    const formattedAnswers = Object.values(answers).map((answer) => answer.replace(/\n/g, " "));
    const answersBackend = [];
    for (let i = 0; i < quiz.questions.length; i++) {
      const answerObj = {
        answer: formattedAnswers[i],
        maxMarks: quiz.questions[i].marks,
        marksAwarded: 0,
      };
      answersBackend.push(answerObj);
    }

    try {
      const { data } = await axios.post("https://sql-autograder-backend.vercel.app/api/students/submit-quiz", {
        answers: answersBackend,
        rollNumber: student.rollNumber,
        quizID: quiz._id,
      });
      if (data.success) {
        const { data: checkData } = await axios.post(
          "https://sql-autograder-backend.vercel.app/api/students/grade-queries",
          {
            studentID: student._id,
            quizID: quiz._id,
          }
        );
        navigate("/quiz/successful", { state: { student: checkData.response } });
      }
      if (!data.success) navigate("/quiz/unsuccessful");
    } catch (error) {
      console.log(error);
      navigate("/quiz/unsuccessful");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (location.state) {
      const { student, quiz } = location.state;
      setStudent(student);
      setQuiz(quiz);
      setMinutes(quiz.duration);
      setSchema(formSQLDatabaseSchema(quiz.databaseSchema, quiz.keyRelationships, quiz.primaryKeys));
      setAnswers(initializeAnswers(quiz.questions.length));
    }
  }, [location.state]);

  return (
    <div className="bg-[#f7f7f7] px-40 py-28 min-h-screen" onContextMenu={(e) => e.preventDefault()}>
      <h1 className="text-3xl">{quiz && quiz.quizName}</h1>
      <p className="text-[#5e5e5e]">
        {student && student.name} - {student && student.rollNumber}
      </p>
      <p className="text-[#5e5e5e]">
        {quiz && quiz.branch} - {quiz && quiz.year}
      </p>
      <p className="mt-4">
        <b>Instructions:</b>
      </p>
      <p className="text-[#5e5e5e]">
        Please provide responses <b>strictly</b> based on the questions.
        <br />
        Refrain from using aliases. For example, <b>do not</b> use aliases like "average_age" for the result of the
        average age calculation.
      </p>
      <p className="text-[#5e5e5e]  text-sm mt-2">
        PS: Sorry folks, we've had to disable the 'Ctrl+C, Ctrl+V' cheat codes for the SQL quiz :(
      </p>
      <div className="flex justify-between">
        <div className="mt-8 w-[42%]">
          <div className="flex justify-between sticky top-[5%]">
            <p className="text-xl">Database Schema</p>
            <p className="text-xl">
              Time Remaining: {minutes < 10 ? "0" + minutes : minutes}:{seconds < 10 ? "0" + seconds : seconds}
            </p>
          </div>
          <div className="font-mono pt-4 sticky top-[11%] text-xs select-none">
            {schema && <CodeBlock text={schema} language={"sql"} showLineNumbers={false} theme={monoBlue} />}
          </div>
        </div>
        <section className="mt-8 w-[55%]">
          <p className="text-xl mb-4">Questions</p>
          {quiz &&
            quiz.questions.map((question, idx) => {
              const field = "answer" + (idx + 1);
              return (
                <Question
                  key={idx + 1}
                  questionNum={idx + 1}
                  field={field}
                  code={answers[field]}
                  setCode={handleCodeChange}
                  question={question}
                />
              );
            })}
          <div className="flex items-center justify-between">
            <button className="py-2 px-2 bg-[#ff4747] rounded text-[#FFF] w-[25%]">Clear Responses</button>
            <button
              className="py-2 px-2 bg-[#4796ff] rounded text-[#FFF] w-[70%] grid place-items-center"
              onClick={handleSubmit}
            >
              {isLoading ? <Loader size="1.5rem" white={true} /> : "Submit"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Quiz;
