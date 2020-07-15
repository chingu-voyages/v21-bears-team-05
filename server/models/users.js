const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

//  User Schema
const userSchema = new Schema({
  method: {
    type: [String],
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
  recipeList: [
    {
      _id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Recipe',
      },
      name: String,
    },
  ],
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
});

userSchema.pre('save', async function (next) {
  try {
    //  If authentication method isn't local(email+pwd)
    //  We call next so we dont create hash
    if (!this.method.includes('local')) {
      next();
    }
    //the user schema is instantiated
    const user = this;
    //check if the user has been modified to know if the password has already been hashed
    if (!user.isModified('local.password')) {
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
const User = mongoose.model('user', userSchema);

module.exports = User;
