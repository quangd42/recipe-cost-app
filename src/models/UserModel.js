const mongoose = require('mongoose');

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

const User = mongoose.model('User', userSchema);

module.exports = {
  User,
};
