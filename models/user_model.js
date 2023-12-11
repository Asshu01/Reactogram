const { default: mongoose } = require("mongoose");
const moongose = require("mongoose");

const userSchema = new moongose.Schema(
  {
    fullName: {
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
    profile_pic: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1542145748-4678edc0b4c5?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dhttps://res.cloudinary.com/djxhcwowp/image/upload/v1597905518/blank-profile-picture-973460_1280_jjwz7m.png",
    },
  },
  { timestamps: true }
);

mongoose.model("UserModel", userSchema);
