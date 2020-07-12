const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

//  User Schema
const userSchema = new Schema({
  method: {
    type: String,
    enum: ['local', 'facebook'],
    required: true,
  },
  local: {
    email: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
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
    email: {
      type: String,
      lowercase: true,
    },
  },
});

userSchema.pre('save', async function (next) {
  try {
    //  If authentication method isn't local(email+pwd)
    //  We call next so we dont create hash
    if (this.method !== 'local') {
      next();
    }
    //  Generate a salt
    const salt = await bcrypt.genSalt(10);
    //  Hash the password
    const passwordHash = await bcrypt.hash(this.local.password, salt);
    this.password = passwordHash;
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