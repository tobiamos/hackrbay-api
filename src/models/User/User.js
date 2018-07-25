const mongoose = require('mongoose');
const { randomBytes, pbkdf2Sync } = require('crypto');
const { promisify } = require('util');
const { secret }

const UserSchema = new mongoose.Schema({
  name: {
    type: String, lowercase: true, trim: true, required: true,
  },
  salt: String,
  hash: String,
}, { timestamps: true });


module.exports = mongoose.model('User', UserSchema);
