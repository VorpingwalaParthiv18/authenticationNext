import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Modal from "./common/Modal";

interface Todo {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  id: string;
}

const Todolist = ({
  refreshTrigger,
  id,
}: {
  refreshTrigger: number;
  id: string;
}) => {
  const [data, setData] = useState<Todo[]>([]);
  const [editId, setEditId] = useState<string>("");
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [editedCompleted, setEditedCompleted] = useState<boolean>(false);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(`/api/Todo/${id}`, { method: "GET" });
        const data = await response.json();
        console.log("Fetched todos:", data);
        setData(data.todos || []);
      } catch (error) {
        console.error("Error fetching todos:", error);
        setData([]);
      }
    };
    fetchTodos();
  }, [refreshTrigger, isModalOpen]);

  const toggleEdit = (id: string, completed: boolean) => {
    setEditId((prev) => (prev === id ? "" : id));

    setEditedCompleted(!completed);
    console.log("status of checkbox:", editedCompleted);
  };

  const openEditModal = (todo: Todo) => {
    setEditId(todo.id);
    setEditedTitle(todo.title);
    setIsModalOpen(true);
    setSelectedTodo(todo);
  };

  const closeModal = () => {
    setEditId("");
    setEditedTitle("");
    setIsModalOpen(false);
    setSelectedTodo(null);
  };

  const handleEdit = async () => {
    // Implement edit functionality here
    if (!selectedTodo) {
      return;
    }

    try {
      const response = await fetch(`/api/Todo`, {
        method: "PATCH",
        body: JSON.stringify({ id: selectedTodo.id, title: editedTitle }),
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
        closeModal();
      } else {
        toast.error(newdata.message);
      }
      // setEditId("");
    } catch (error: any) {
      toast.error("Failed to update todo", error);
    }
  };

  const handleDelete = async (id: string) => {
    console.log("Deleting todo with id:", id);
    try {
      const response = await fetch("/api/Todo", {
        method: "DELETE",
        body: JSON.stringify({ id }), // Add this
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      console.log("Response from delete API:", data);
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
    <div className="space-y-4 mt-6 relative">
      {data.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-dashed border-gray-300">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            No todos yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new todo above.
          </p>
        </div>
      ) : (
        data.map((todo, index) => (
          <div
            key={todo.id}
            className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            // style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Left border accent */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />

            <div className="flex items-center justify-between p-5">
              {/* Left side - Checkbox and Title */}
              <div className="flex items-center gap-4 flex-1">
                <div className="relative">
                  {/* <input
                    type="checkbox"
                    checked={editId == todo.id}
                    onChange={() => toggleEdit(todo.id, todo.completed)}
                    className="w-6 h-6 text-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer border-2 border-gray-300 transition-all"
                    readOnly
                  /> */}
                </div>
                <div className="flex flex-col flex-1">
                  <span
                    className={`text-lg font-medium transition-all ${
                      todo.completed
                        ? "line-through text-gray-400"
                        : "text-gray-800"
                    }`}
                  >
                    {todo.title}
                  </span>
                  {todo.description && (
                    <span className="text-sm text-gray-500 mt-1">
                      {todo.description}
                    </span>
                  )}
                </div>
              </div>

              {/* Right side - Action buttons */}
              <div className="flex gap-2">
                {/* Edit button */}
                <button
                  className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110 group/edit"
                  title="Edit todo"
                  onClick={() => openEditModal(todo)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 transition-transform group-hover/edit:rotate-12"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                </button>

                {/* Delete button */}

                {editedCompleted ? (
                  <button
                    className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110 group/delete"
                    title="Delete todo"
                    onClick={() => handleDelete(todo.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5 transition-transform group-hover/delete:scale-110"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                ) : (
                  <button
                    className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110 group/delete"
                    title="Delete todo"
                    onClick={() => handleDelete(todo.id)}
                    disabled
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5 transition-transform group-hover/delete:scale-110"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
      <ToastContainer />
      <Modal isOpen={isModalOpen} isClose={closeModal} title="Edit Todo">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Title
            </label>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full border text-white border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter todo title"
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button
              onClick={closeModal}
              className="px-5 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => handleEdit()}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Todolist;
