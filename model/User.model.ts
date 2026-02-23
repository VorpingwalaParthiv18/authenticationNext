import mongoose from "mongoose";

const ROLE_LEVEL = {
  superadmin: 3,
  admin: 2,
  user: 1,
};

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["superadmin", "admin", "user"],
      default: "user",
    },
    roleLevel: {
      type: Number,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", function () {
  if (this.role) {
    this.roleLevel = ROLE_LEVEL[this.role as keyof typeof ROLE_LEVEL];
  }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
