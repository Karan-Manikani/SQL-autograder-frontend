import React, { useState, useEffect, useCallback, useRef } from "react";

const Autocomplete = ({ handleKeyRelationsChange, database, relation, idx, field }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const dropdownRef = useRef(null);

  // const tables = ["table1", "table2", "table3"];
  // const columns = ["column1", "column2", "column3"];
  let columns = database[relation];
  if (!columns) columns = [];

  const handleInputChange = (e) => {
    const value = e.target.value;
    // setInputValue(value);
    handleKeyRelationsChange(idx, field, value);

    if (value.includes(".")) {
      const [table, columnPrefix] = value.split(".");
      const columnSuggestions = columns.filter((col) => col.startsWith(columnPrefix));
      setSuggestions(columnSuggestions.map((col) => `${table}.${col}`));
    } else {
      setSuggestions(Object.keys(database).filter((table) => table.startsWith(value)));
    }
    setSelectedSuggestion(0);
  };

  const handleSuggestionClick = useCallback((suggestion) => {
    // setInputValue(suggestion);
    handleKeyRelationsChange(idx, field, suggestion);
    setSuggestions([]);
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedSuggestion((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedSuggestion((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
      } else if (e.key === "Enter") {
        if (suggestions[selectedSuggestion]) {
          handleSuggestionClick(suggestions[selectedSuggestion]);
        }
      } else if (e.key === "Escape") {
        setSuggestions([]);
      }
    },
    [handleSuggestionClick, suggestions, selectedSuggestion]
  );

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [handleKeyDown]);

  return (
    <div className="w-[37%] relative" ref={dropdownRef}>
      <input
        type="text"
        value={relation}
        onChange={handleInputChange}
        placeholder="table.column"
        className="bg-[#f0f0f0] text-[#5e5e5e] focus:outline-none rounded-lg px-4 py-2 placeholder:italic w-full"
      />
      {suggestions.length !== 0 && (
        <ul className="absolute z-10 p-1 bg-white w-full mt-2 rounded-lg">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`py-1 px-2 rounded-lg ${
                index === selectedSuggestion ? "bg-[#4796ff] text-white" : ""
              }`}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
