const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

//  User Schema
const userSchema = new Schema(
  {
    method: {
      type: [String],
      enum: ["local", "facebook", "google"],
      required: true,
    },
    avatar: { type: String },
    name: { type: String },
    bio: { type: String },
    cupboard: [{ type: String }],
    recipeList: [{ type: String }],
    ratings: [
      {
        uuid: { type: String, required: true },
        stars: { type: Number, max: 10, required: true },
      },
    ],
    local: {
      name: {
        type: String,
      },
      surname: {
        type: String,
      },
      email: {
        type: String,
      },
      password: {
        type: String,
      },
    },
    facebook: {
      id: {
        type: String,
      },
      name: {
        type: String,
      },
      surname: {
        type: String,
      },
      email: {
        type: String,
      },
    },
    google: {
      id: {
        type: String,
      },
      email: {
        type: String,
      },
      name: {
        type: String,
      },
      surname: {
        type: String,
      },
    },
  },
  {
    _id: mongoose.Schema.ObjectId,
    timestamps: { createdAt: "dateCreated", updatedAt: "dateUpdated" },
  }
);

userSchema.pre("save", async function (next) {
  try {
    //  If authentication method isn't local(email+pwd)
    //  We call next so we dont create hash
    if (!this.method.includes("local")) {
      next();
    }
    //the user schema is instantiated
    const user = this;
    //check if the user has been modified to know if the password has already been hashed
    if (!user.isModified("local.password")) {
      next();
    }
    //  Generate a salt
    const salt = await bcrypt.genSalt(10);
    //  Hash the password
    const passwordHash = await bcrypt.hash(this.local.password, salt);
    const emailHash = await bcrypt.hash(this.local.email, salt);
    this.local.password = passwordHash;
    this.local.email = emailHash;
    next();
  } catch (error) {
    next(error);
  }
});
//  Check if local password hash match
userSchema.methods.isValidPassword = async function (newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.local.password);
  } catch (error) {
    throw new Error(error);
  }
};
//  Check if local email hash match
userSchema.methods.isValidEmailLocal = async function (newEmail) {
  try {
    return await bcrypt.compare(newEmail, this.local.email);
  } catch (error) {
    throw new Error(error);
  }
};
//  Check if google email match
userSchema.methods.isValidEmailGoogle = async function (newEmail) {
  try {
    return await bcrypt.compare(newEmail, this.google.email);
  } catch (error) {
    throw new Error(error);
  }
};
//  Check if facebook email match
userSchema.methods.isValidEmailFacebook = async function (newEmail) {
  try {
    return await bcrypt.compare(newEmail, this.facebook.email);
  } catch (error) {
    throw new Error(error);
  }
};
//  Check if facebook email match
userSchema.methods.isValidIDGoogle = async function (newID) {
  try {
    return await bcrypt.compare(newID, this.google.id);
  } catch (error) {
    throw new Error(error);
  }
};
//  Check if facebook email match
userSchema.methods.isValidIDFacebook = async function (newID) {
  try {
    return await bcrypt.compare(newID, this.facebook.id);
  } catch (error) {
    throw new Error(error);
  }
};

// Duplicate the ID field.
userSchema.virtual("uuid").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
userSchema.set("toJSON", {
  virtuals: true,
});

//  Create a model
const User = mongoose.model("user", userSchema);

module.exports = User;
