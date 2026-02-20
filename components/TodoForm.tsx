import { useState } from "react";
import Todolist from "./Todolist";
import { toast, ToastContainer } from "react-toastify";
import { set } from "mongoose";

const TodoForm = () => {
  //   const [todo, setTodo] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/Todo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: input }),
    });
    const data = await response.json();
    console.log("Response from server:", data);
    // if (data.ok) {
    toast.success(data.message);
    console.log("Todo saved successfully:", data);
    // } else {
    //   toast.error(data.error || "Failed to save todo");
    // }
    setInput("");
    setRefreshTrigger((prev) => prev + 1);
  };
  return (
    <>
      <div>
        <label htmlFor="Todos">Add a new todo:</label>
        <br />
        <div className="flex flex-row gap-2">
          <input
            type="text"
            onChange={(e) => setInput(e.target.value)}
            value={input}
            className="bg-white p-2 rounded-lg shadow-md w-100 text-black"
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white p-2 rounded-lg shadow-md"
          >
            Submit
          </button>
        </div>
      </div>
      <Todolist refreshTrigger={refreshTrigger} />
      <ToastContainer />
    </>
  );
};

export default TodoForm;
