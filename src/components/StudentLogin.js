// import React from "react";

// function StudentLogin(props) {
//   return (
//     <div className="p-8 rounded-md bg-white w-1/4">
//       <div className="grid grid-cols-2 gap-4">
//         <button
//           className={
//             props.active === "students"
//               ? "p-2 bg-[#4796ff] rounded hover:cursor-pointer text-[#FFF]"
//               : "p-2 rounded hover:cursor-pointer text-[#000]"
//           }
//           value={"students"}
//           onClick={props.handleTogglerClick}
//         >
//           Students
//         </button>
//         <button
//           className={
//             props.active === "teachers"
//               ? "p-2 bg-[#4796ff] rounded hover:cursor-pointer text-[#FFF]"
//               : "p-2 rounded hover:cursor-pointer text-[#000]"
//           }
//           value={"teachers"}
//           onClick={props.handleTogglerClick}
//         >
//           Teachers
//         </button>
//       </div>
//       <input
//         type="text"
//         className="bg-[#f0f0f0] text-[#5e5e5e] focus:outline-none rounded-lg px-4 py-2 mt-8 placeholder:italic w-full"
//         placeholder="Name"
//       />
//       <div className="flex flex-row justify-between mt-4 w-full">
//         <input
//           type="text"
//           className="bg-[#f0f0f0] text-[#5e5e5e] focus:outline-none rounded-lg px-4 py-2 placeholder:italic w-1/3"
//           placeholder="Roll No."
//         />
//         <input
//           type="text"
//           className="bg-[#f0f0f0] text-[#5e5e5e] focus:outline-none rounded-lg px-4 py-2 placeholder:italic w-3/5"
//           placeholder="SAP ID"
//         />
//       </div>
//       <input
//         type="text"
//         className="bg-[#f0f0f0] text-[#5e5e5e] focus:outline-none rounded-lg px-4 py-2 placeholder:italic w-full mt-4"
//         placeholder="Room ID"
//       />
//       <button className="p-2 bg-[#4796ff] rounded hover:cursor-pointer text-[#FFF] mt-8 w-full">
//         Join and Begin
//       </button>
//     </div>
//   );
// }

// export default StudentLogin;
