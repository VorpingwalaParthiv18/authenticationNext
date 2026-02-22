import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    id:{
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const Todo = mongoose.models.Todo || mongoose.model("Todo", todoSchema);

export default Todo;
