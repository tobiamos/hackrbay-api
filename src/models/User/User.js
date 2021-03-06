const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { randomBytes, pbkdf2Sync } = require('crypto');
const { secret } = require('../../config');

const UserSchema = new mongoose.Schema({
  username: {
    type: String, lowercase: true, trim: true, required: 'Please provide a username',
  },
  salt: String,
  hash: String,
}, { timestamps: true });

UserSchema.methods.hashPassword = function setPassword(password) {
  this.salt = randomBytes(16).toString('hex');
  this.hash = pbkdf2Sync(password, this.salt, 100, 64, 'sha512').toString('hex');
};

UserSchema.methods.validPassword = function validate(password) {
  const hash = pbkdf2Sync(password, this.salt, 100, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

UserSchema.methods.generateJWT = function token() {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
    },
    secret,
    {
      issuer: 'https://hackerbay.io',
      expiresIn: '7d',
    },
  );
};


module.exports = mongoose.model('User', UserSchema);
