const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 30,
    match: /^(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9]{6,30}$/,
  },
});

userSchema.pre('save', async function () {
  try {
    this.password = await bcrypt.hash(this.password, saltRounds);
  } catch (err) {
    throw err;
  }
});

const User = mongoose.model('User', userSchema);

module.exports = {
  User,
};
