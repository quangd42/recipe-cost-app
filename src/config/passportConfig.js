const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const { User } = require('../models/UserModel');

// Set up Passport
const strategy = new LocalStrategy({ usernameField: 'email' }, async function (
  email,
  password,
  next,
) {
  try {
    const user = await User.findOne({ email: email }).exec();
    console.log('const user', user);
    if (!user) {
      return next(null, false);
    }
    const passwordVerified = await user.verifyPassword(password);
    console.log('passwordVerified?', passwordVerified);
    if (!passwordVerified) {
      return next(null, false);
    }
    return next(null, user);
  } catch (err) {
    return next(err);
  }
});

passport.use(strategy);

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser(async (userId, cb) => {
  try {
    const user = await User.findById(userId);
    return cb(null, user);
  } catch (err) {
    return cb(err);
  }
});

module.exports = {
  passport,
};
