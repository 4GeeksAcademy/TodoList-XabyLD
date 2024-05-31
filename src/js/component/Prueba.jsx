import React, { useState, useEffect } from "react";

const Home = () => {
  const [task, SetTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const controlInput = (event) => {
    const value = event.target.value;
    console.log(value);
    SetTask(value);
  };

  useEffect(() => {
    const handleKeyUp = (event) => {
      if (event.key === "Enter" && task.trim() !== "") {
        setTasks([...tasks, task]);
        SetTask("");
      }
    };

    document.addEventListener("keyup", handleKeyUp);

    // Clean up the event listener
    return () => {
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [task, tasks]);

  return (
    <div>
      <input
        type="text"
        value={task}
        onChange={controlInput}
        placeholder="Escribe algo..."
      />
      <ul id="myUl">
        {tasks.map((item, index) => (
          <li key={index}>
            {item} <i class="fa-solid fa-x "></i>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
