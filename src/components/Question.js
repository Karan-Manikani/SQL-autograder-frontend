import React from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import Editor from "react-simple-code-editor";

function Question(props) {
  const handleChange = (e) => {
    e.preventDefault();
  };

  return (
    <div className="w-full bg-white drop-shadow-[0_0_10px_rgba(70,150,255,0.1)] rounded font-thin p-6 mb-8 font-[ubuntu]">
      <div className="flex justify-between items-center">
        <p>Question {props.questionNum}</p>
        <p>
          {props.question.marks} {props.question.marks > 1 ? "Marks" : "Mark"}
        </p>
      </div>
      <p className="font-normal mt-2">{props.question.question}</p>
      <CodeEditor
        value={props.code}
        language="sql"
        placeholder="Write your code here"
        onChange={(e) => props.setCode(e.target.value, props.field)}
        padding={10}
        onCopy={handleChange}
        onCut={handleChange}
        onPaste={handleChange}
        style={{
          fontSize: 16,
          backgroundColor: "#f4f4f4",
          fontFamily: "ui-monospace,SFMono-Regular,SF Mono,Consolas",
          marginTop: "0.5rem",
        }}
      />
    </div>
  );
}

export default Question;
