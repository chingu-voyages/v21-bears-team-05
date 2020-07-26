const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const urlPath = process.env.IMAGE_BASE_URL_PATH;

//  User Schema
const userSchema = new Schema({
  method: {
    type: String,
    enum: ["local", "facebook", "google"],
    required: true,
  },
  local: {
    name: {
      type: String,
    },
    surname: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
    },
    password: {
      type: String,
    },
  },
  facebook: {
    id: {
      type: String,
      lowercase: true,
    },
    name: {
      type: String,
    },
    surname: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
    },
  },
  google: {
    id: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      lowercase: true,
    },
    name: {
      type: String,
    },
    surname: {
      type: String,
    },
  },
  avatar: {
    type: String,
    get: (val) => `${urlPath}${val}`,
  },
  cupboard: [
    {
      _id: {
        type: mongoose.Schema.ObjectId,
        ref: "Ingredients",
      },
      name: String,
    },
  ],
  recipeList: [
    {
      _id: {
        type: mongoose.Schema.ObjectId,
        ref: "Recipe",
      },
      title: String,
    },
  ],
  ratings: [
    {
      _id: {
        type: mongoose.Schema.ObjectId,
        ref: "Recipe",
      },
      stars: { type: Number, max: 10 },
    },
  ],
});

userSchema.pre("save", async function (next) {
  try {
    //  If authentication method isn't local(email+pwd)
    //  We call next so we dont create hash
    if (this.method !== "local") {
      next();
    }
    //  Generate a salt
    const salt = await bcrypt.genSalt(10);
    //  Hash the password
    const passwordHash = await bcrypt.hash(this.local.password, salt);
    this.local.password = passwordHash;
    next();
  } catch (error) {
    next(error);
  }
});

//  We check if newPassword is the same as our User's password
userSchema.methods.isValidPassword = async function (newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.local.password);
  } catch (error) {
    throw new Error(error);
  }
};
//  Create a model
const User = mongoose.model("user", userSchema);

module.exports = User;
