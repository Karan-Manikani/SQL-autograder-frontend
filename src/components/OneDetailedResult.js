import React from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";

function OneDetailedResult(props) {
  console.log(props.modelQuery);
  console.log(props.studentQuery);
  return (
    <div className="mt-8">
      <p className="mb-4">{`${props.questionNum}) ${props.modelQuery.question}`} </p>
      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white p-6">
          <div className="flex justify-between text-[#5e5e5e]">
            <p>
              Your Answer:{" "}
              <span
                className={
                  props.studentQuery.marksAwarded === props.studentQuery.maxMarks
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {props.studentQuery.marksAwarded === props.studentQuery.maxMarks
                  ? "Correct"
                  : "Wrong"}
              </span>
            </p>
            <p>Marks recieved: {props.studentQuery.marksAwarded}</p>
          </div>
          <CodeEditor
            value={props.studentQuery.answer}
            language="sql"
            placeholder="Write your code here"
            padding={10}
            disabled={true}
            style={{
              fontSize: 16,
              backgroundColor: "#f4f4f4",
              fontFamily: "ui-monospace,SFMono-Regular,SF Mono,Consolas",
              marginTop: "0.5rem",
              userSelect: "none",
            }}
          />
        </div>
        <div className="bg-white p-6">
          <div className="flex justify-between text-[#5e5e5e]">
            <p>Actual Answer</p>
            <p>Maximum Marks: {props.studentQuery.maxMarks}</p>
          </div>
          <CodeEditor
            value={props.modelQuery.answer}
            language="sql"
            placeholder="Write your code here"
            padding={10}
            disabled={true}
            style={{
              fontSize: 16,
              backgroundColor: "#f4f4f4",
              fontFamily: "ui-monospace,SFMono-Regular,SF Mono,Consolas",
              marginTop: "0.5rem",
              userSelect: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default OneDetailedResult;
