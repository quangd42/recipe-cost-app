const { User } = require('../models/UserModel');

const createUser = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });

  if (existingUser) {
    throw new Error('Email taken');
  }

  const user = new User(userData);
  return await user.save();
};

const getUser = async (userId) => {
  return await User.findById(userId);
};

module.exports = {
  createUser,
  getUser,
};
