import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

interface Todo {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  id: string;
}

const Todolist = ({ refreshTrigger }: { refreshTrigger: number }) => {
  const [data, setData] = useState<Todo[]>([]);
  const [editId, setEditId] = useState<string>("");
  const [editedTitle, setEditedTitle] = useState<string>("");

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch("api/Todo", { method: "GET" });
      const data = await response.json();
      console.log("Fetched todos:", data);
      setData(data.todos);
    };
    fetchTodos();
  }, [refreshTrigger]);

  const toggleEdit = (id: string, currentTitle: string) => {
    setEditId((prev) => (prev === id ? "" : id));

    setEditedTitle(currentTitle);
  };

  const handleEdit = async (id: string) => {
    // Implement edit functionality here
    try {
      const response = await fetch(`api/Todo`, {
        method: "PATCH",
        body: JSON.stringify({ id, title: editedTitle }),
        headers: { "Content-Type": "application/json" },
      });
      const newdata = await response.json();

      if (response.ok) {
        toast.success(newdata.message);
        setData((prevData) =>
          prevData.map((todo) =>
            todo.id === id ? { ...todo, title: editedTitle } : todo,
          ),
        );
      } else {
        toast.error(newdata.message);
      }
      setEditId("");
    } catch (error: any) {
      toast.error("Failed to update todo", error);
    }
  };

  const handleDelete = async (id: string) => {
    console.log("Deleting todo with id:", id);
    try {
      const response = await fetch("api/Todo", {
        method: "DELETE",
        body: JSON.stringify({ id }), // Add this
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      if (!data) {
        toast.error("Failed to delete todo");
        return;
      }
      if (response.ok) {
        toast.success("deleted successfully");
        setData((prevData) => prevData.filter((todo) => todo.id !== id));
      } else {
        toast.error(data.message || "Failed to delete todo");
      }
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <div className="space-y-3 p-4">
      {data.map((todo) => (
        <div
          key={todo.id}
          className="flex items-center justify-between bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
        >
          {/* Left side - Checkbox and Title */}
          <div className="flex items-center gap-3 flex-1">
            <input
              type="checkbox"
              checked={editId === todo.id}
              onChange={() => toggleEdit(todo.id, todo.title)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
            <div className="flex flex-col">
              <span
                className={`text-lg ${
                  todo.completed
                    ? "line-through text-gray-400"
                    : "text-gray-800"
                }`}
              >
                {editId === todo.id ? (
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-300 border border-gray-300 rounded-lg px-2 py-1"
                  />
                ) : (
                  <span>{todo.title}</span>
                )}
              </span>
            </div>
          </div>

          {/* Right side - Action buttons */}
          <div className="flex gap-2">
            {/* Edit button */}
            <button
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit todo"
              onClick={() => handleEdit(todo.id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            </button>

            {/* Delete button */}
            <button
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete todo"
              onClick={() => handleDelete(todo.id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
      <ToastContainer />
    </div>
  );
};

export default Todolist;
