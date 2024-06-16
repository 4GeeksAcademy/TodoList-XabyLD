import React, { useEffect, useState } from "react";

/*
TODO  
--> Revisar botón para que SOLO mande la notificación 1 vez de las tareas borradas

*/

//create your first component
const Home = () => {
  const [task, SetTask] = useState("");
  const [tasks, SetTasks] = useState([]);
  const [countLi, SetCountLi] = useState(0);
  const [username, setUsername] = useState("");
  //const [isEnter, setIsEnter] = useState(false);
  const [lastUsername, setLastUsername] = useState("");
  const [idTask, setIdTask] = useState(0);
  //Visualizamos usuario activo
  console.log(lastUsername);
  //Visualizamos array de tareas
  console.log(tasks);

  const toDoGetTasks = async (lastUsername) => {
    try {
      const response = await fetch(
        `https://playground.4geeks.com/todo/users/${lastUsername}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        }
      );

      const result = await response.json();

      console.log(result); //Enseñamos el usuario con las tareas por consola
      if (!result.todos) return; //Si no tenemos tareas no hacemos nada
      SetTasks(result.todos); // Si existen tareas setea las tareas.
    } catch (error) {
      console.log(error);
    }
  };
  const toDoUsers = async (toDo) => {
    console.log(toDo); //Tarea que le llega al método POST de la API
    try {
      const response = await fetch(
        `https://playground.4geeks.com/todo/todos/${lastUsername}`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(toDo),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log(result); //Tenemos la tarea
      /* SetTasks((prevTasks) => [...prevTasks, result.label]);
      return result; */
    } catch (error) {
      console.log(error);
    }
  };

  const createUsernameAPI = async (lastUsername) => {
    console.log(lastUsername);
    try {
      const response = await fetch(
        `https://playground.4geeks.com/todo/users/${lastUsername}`,

        {
          method: "POST",
          headers: {
            accept: "application/json",
          },
        }
      );
      const resultUser = await response.json();
      if (resultUser.details === "User already exists") {
        toDoGetTasks(lastUsername);
      }
      console.log(resultUser);
    } catch (error) {
      console.log(error);
    }
  };

  const toDoPutUsers = async (id) => {
    try {
      const toDo = tasks.find((task) => task.id == id);

      toDo.is_done = true;
      const response = await fetch(
        `https://playground.4geeks.com/todo/todos/${id}`,
        {
          method: "PUT",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(toDo),
        }
      );
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const toDoDeleteAll = () => {
    tasks.map((task) => toDoDeleteTask(task.id));
    SetTasks([]);
  };

  const toDoDeleteTask = async (id) => {
    const newList = tasks.filter((task) => task.id !== id);
    console.log(newList);
    SetTasks(newList);
    console.log("Esta es la :" + id);

    try {
      const response = await fetch(
        `https://playground.4geeks.com/todo/todos/${id}`,
        {
          method: "DELETE",
          headers: {
            accept: "aplication/json",
          },
        }
      );
      /* if (response.ok == true) {
        alert("La tarea se elimino correctamente");
      } */
    } catch (error) {
      console.log(error);
    }
  };

  const controlInput = (event) => {
    const value = event.target.value;
    console.log(value);
    SetTask(value);
  };

  const controlUser = (event) => {
    setUsername(event.target.value);
    console.log(username);
  };

  const saveUsername = (event) => {
    if (event.key === "Enter") {
      setLastUsername(username);
      createUsernameAPI(event.target.value);
      alert("Username Guardado");
    }
  };

  useEffect(() => {
    // Actualiza el contador cada vez que cambia la lista de items
    SetCountLi(tasks.length);
  }, [tasks]);

  useEffect(() => {
    if (!lastUsername) {
      return "el usuario está vacío";
    } else {
      const handleKeyUp = (event) => {
        //Nos aseguramos que la tarea no sea en blanco para que NO la añada y que pulse la tecla enter para añadirla
        if (event.key === "Enter" && task.trim() !== "") {
          // SetTasks([...tasks, task]);
          console.log(task);
          const newTask = { label: task, is_done: false, id: task.id };
          console.log(newTask);
          toDoUsers(newTask);
          SetTasks((prevTasks) => [...prevTasks, newTask]);
          SetTask("");

          //setIsEnter(!isEnter);
        }
      };
      document.addEventListener("keyup", handleKeyUp);

      return () => {
        document.removeEventListener("keyup", handleKeyUp);
      };
    }
  }, [task]);

  useEffect(() => {
    toDoPutUsers();
  }, []);

  useEffect(() => {
    if (!lastUsername) return;
    toDoGetTasks(lastUsername);
  }, [lastUsername]);
  //Creación de Usuario en API
  /*  useEffect(() => {
    const handleKeyUp = (event) => {
      if (event.key === "Enter" && username.trim() !== "") {
        const newUser = username;
        // createUsernameAPI(newUser);
        setUsername("");
      }
    };
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [username]); */

  return (
    <>
      <div className="d-flex justify-content-center gap-3 mt-4">
        <label>Create UserName:</label>
        <input
          type="text"
          onChange={controlUser}
          onKeyDown={saveUsername}
        ></input>
      </div>
      <h1 className="text-center bold mt-5">
        Todo App<span> {lastUsername}</span>
      </h1>
      <div className="d-flex justify-content-center">
        <div className=" w-75 py-2 px-2">
          <input
            type="text"
            value={task}
            onChange={controlInput}
            className="form-control form-control-lg"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-lg"
            placeholder="Let me your tasks for save it!"
          />
        </div>
      </div>
      {tasks.length === 0 ? (
        <p className="text-center fs-2">Sin tareas</p>
      ) : (
        <ul
          id="myUl"
          className="list-group list-unstyled  text-xl d-flex flex-wrap align-content-center"
        >
          {tasks.map((item, index) => (
            <li
              className=" mt-0 fs-1 border border-1 w-75 d-flex justify-content-between "
              key={index}
              id={item.id}
            >
              <span>{item.label}</span>

              <div className="d-flex gap-3">
                <button
                  onClick={() => toDoPutUsers(item.id)}
                  type="button"
                  className="btn btn-success btn-md"
                >
                  <i className="fa-solid fa-check"></i>
                </button>
                <button
                  onClick={() => toDoDeleteTask(item.id)}
                  type="button"
                  className="btn btn-danger btn-md"
                >
                  <i className="fa-solid fa-trash "></i>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className=" d-flex justify-content-between w-75 py-2 px-2">
        <p className="py-2 px-4">Total items: {countLi}</p>
        <button
          className="btn btn-danger"
          onClick={() => toDoDeleteAll()}
          type="button"
        >
          Delete All Tasks
        </button>
      </div>
    </>
  );
};

export default Home;
