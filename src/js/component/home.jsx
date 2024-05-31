import React, { useEffect, useState } from "react";

//create your first component
const Home = () => {
  const [task, SetTask] = useState("");
  const [tasks, SetTasks] = useState([]);

  const controlInput = (event) => {
    const value = event.target.value;
    console.log(value);
    SetTask(value);
  };

  useEffect(() => {
    const handleKeyUp = (event) => {
      //Nos aseguramos que la tarea no sea en blanco para que NO la añada y que pulse la tecla enter para añadirla
      if (event.key === "Enter" && task.trim() !== "") {
        SetTasks([...tasks, task]);
        SetTask("");
      }
    };
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [task, tasks]);

  return (
    <>
      <h1 className="text-center bold">ToDo App</h1>
      <div className="input-group input-group-lg">
        <input
          type="text"
          value={task}
          onChange={controlInput}
          class="form-control"
          aria-label="Sizing example input"
          aria-describedby="inputGroup-sizing-lg"
          placeholder="Let me your tasks for save it!"
        />
      </div>
      <ul
        id="myUl"
        className="list-group list-unstyled  text-xl d-flex flex-wrap align-content-center"
      >
        {tasks.map((item, index) => (
          <li
            className="text-center mt-3 fs-1 border border-3 w-75"
            key={index}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
};

export default Home;
