import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  profilePicture: {
    type: String,
    default: "https://res.cloudinary.com/dilwqr0x9/image/upload/v1754684495/default_zf3brg.jpg",
  },
  createdAt: { type: Date, default: Date.now },
  token: {
    type: String,
    default: "",
  },
});

const User = mongoose.model("User", UserSchema);
export default User;
