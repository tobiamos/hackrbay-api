const User = require('../../models/User/User');
const { validUser } = require('../factory');


module.exports.removeUsers = done => {
  User.remove({}).then(() => done());
};

module.exports.createUser = (done) => {
  User.remove({}).then(() => {
  const user = new User();
  user.username = validUser().username;
  user.hashPassword = validUser().password;
  const userPromise = user.save();
  return Promise.all([userPromise]);
}).then(() => done());
}
