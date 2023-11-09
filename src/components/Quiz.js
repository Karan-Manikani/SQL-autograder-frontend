import React, { useEffect, useState } from "react";
import { CodeBlock, monoBlue } from "react-code-blocks";
import Question from "./Question";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [student, setStudent] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [schema, setSchema] = useState(null);
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let timer;

    if (minutes === 0 && seconds === 0) {
      // fetch('https://your-backend-endpoint.com', {
      //   method: 'POST',
      //   // Add any necessary headers or payload here
      // })
      //   .then(response => response.json())
      //   .then(data => console.log(data))
      //   .catch(error => console.error('Error:', error));
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
    console.log(keyRelationships);
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
      const { data } = await axios.post("http://localhost:8081/api/students/submit-quiz", {
        answers: answersBackend,
        rollNumber: student.rollNumber,
        quizID: quiz._id,
      });
      if (data.success) {
        const { data: checkData } = await axios.post(
          "http://localhost:8081/api/students/grade-queries",
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
    }
  }

  useEffect(() => {
    if (location.state) {
      const { student, quiz } = location.state;
      setStudent(student);
      setQuiz(quiz);
      setMinutes(quiz.duration);
      setSchema(
        formSQLDatabaseSchema(quiz.databaseSchema, quiz.keyRelationships, quiz.primaryKeys)
      );
      setAnswers(initializeAnswers(quiz.questions.length));
    }
  }, [location.state]);

  return (
    <div className="bg-[#f7f7f7] px-40 py-28 min-h-screen">
      <h1 className="text-3xl">{quiz && quiz.quizName}</h1>
      <p className="text-[#5e5e5e]">
        {student && student.name} - {student && student.rollNumber}
      </p>
      <p className="text-[#5e5e5e]">
        {quiz && quiz.branch} - {quiz && quiz.year}
      </p>
      <div className="flex justify-between">
        <div className="mt-8 w-[42%]">
          <div className="flex justify-between sticky top-[5%]">
            <p className="text-xl">Database Schema</p>
            <p className="text-xl">
              Time Remaining: {minutes < 10 ? "0" + minutes : minutes}:
              {seconds < 10 ? "0" + seconds : seconds}
            </p>
          </div>
          <div className="font-mono mt-4 sticky top-[11%] text-xs">
            {schema && (
              <CodeBlock
                // text={
                //   "TABLE Names\n  id INT PRIMARY KEY\n  name VARCHAR\n  job VARCHAR\n \nTABLE Jobs\n  id INT PRIMARY KEY\n  job_title VARCHAR\n \nNames.job REFERENCES Jobs.job_title"
                // }
                text={schema}
                language={"sql"}
                showLineNumbers={false}
                theme={monoBlue}
              />
            )}
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
            <button className="py-2 px-2 bg-[#ff4747] rounded text-[#FFF] w-[25%]">
              Clear Responses
            </button>
            <button
              className="py-2 px-2 bg-[#4796ff] rounded text-[#FFF] w-[70%]"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Quiz;
