import React, { useEffect, useState } from "react";
import { Todo } from "./Todo";
import { TodoForm } from "./TodoForm";
import { v4 as uuidv4 } from "uuid";
import { EditTodoForm } from "./EditTodoForm";
import axios from "axios";

const BACKEND_URL = "http://localhost:5000/items/";

export const TodoWrapper = () => {
  const [todos, setTodos] = useState([]);

  // fetching the data
  useEffect(() => {
    axios
      .get(BACKEND_URL)
      .then((res) => {
        setTodos(
          res.data.map((item) => {
            const editedItem = {
              completed: item.completed,
              isEditing: item.isEditing,
              task: item.task,
              id: item._id,
            };
            return editedItem;
          })
        );
      })
      .catch((err) => console.log(err));
  }, []);

  const addTodo = (todo) => {
    axios
      .post(BACKEND_URL, { task: todo })
      .then((res) => {
        setTodos([
          ...todos,
          { id: res.data._id, task: todo, completed: false, isEditing: false },
        ]);
      })
      .catch((err) => console.log(err));
  };

  const deleteTodo = (id) => {
    axios
      .delete(BACKEND_URL + id)
      .then(() => setTodos(todos.filter((todo) => todo.id !== id)))
      .catch((err) => console.log(err));
  };

  const toggleComplete = (id) => {
    axios
      .patch(BACKEND_URL + id, { toBeChanged: "completed" })
      .then((res) => {
        setTodos(
          todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          )
        );
      })
      .catch((err) => console.log(err));
  };

  const editTodo = (id) => {
    axios
      .patch(BACKEND_URL + id, { toBeChanged: "isEditing" })
      .then(() => {
        setTodos(
          todos.map((todo) =>
            todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
          )
        );
      })
      .catch((err) => console.log("err", err));
  };

  const editTask = (task, id) => {
    axios
      .patch(BACKEND_URL + id, { toBeChanged: "isEditing", task })
      .then(() => {
        setTodos(
          todos.map((todo) =>
            todo.id === id
              ? { ...todo, task, isEditing: !todo.isEditing }
              : todo
          )
        );
      })
      .catch((err) => console.log(err));
  };
  // task - task : task
  return (
    <div className="TodoWrapper">
      <h1>Get Things Done !</h1>
      <TodoForm addTodo={addTodo} />
      {/* display todos */}
      {todos.map((todo) =>
        todo.isEditing ? (
          <EditTodoForm editTodo={editTask} task={todo} />
        ) : (
          <Todo
            key={todo.id}
            task={todo}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
            toggleComplete={toggleComplete}
          />
        )
      )}
    </div>
  );
};
