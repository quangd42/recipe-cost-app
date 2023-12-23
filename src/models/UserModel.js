const Joi = require('joi');

const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).allow('.').trim().required(),
  email: Joi.string().email({ minDomainSegments: 2 }).trim().required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
});

class User {
  constructor(userData) {
    userSchema.validate(userData);
    this.name = userData.name;
    this.email = userData.email;
    this.password = userData.password;
  }
}

module.exports = User;
