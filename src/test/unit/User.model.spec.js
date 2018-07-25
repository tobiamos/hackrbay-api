const { expect } = require('chai');
const User = require('../../models/User/User');

describe('User', () => {
  it('Should be invalid if name is empty', async() => {
    try {
      const user = new User();
      await user.validate();
    } catch (error) {
      expect(error.name).to.equal('ValidationError')
      expect(error.message).to.equal('User validation failed: username: Please provide a username')
    }
  });
  it('should create hash and salt from a password', (done) => {
    const password = 'password';
    const user = new User();
    user.hashPassword(password);
    expect(user.hash).to.exist;
    expect(user.salt).to.exist;
    expect(user.hash).to.be.a('string');
    expect(user.salt).to.be.a('string');
    expect(user.salt).to.have.lengthOf(32);
    expect(user.hash).to.have.lengthOf(128);
    done();
  });
  it('Should return true if when correct password is passed', (done) => {
    const user = new User();
    const password = 'password';
    user.hashPassword(password);
    const result = user.validPassword(password);
    expect(result).to.be.a('boolean');
    expect(result).to.be.true;
    done();
  });

  it('Should return false if incorrect password is passed', (done) => {
    const user = new User();
    const password = 'password';
    const wrongPassword = 'pa$$word';
    user.hashPassword(password);
    const result = user.validPassword(wrongPassword);
    expect(result).to.be.a('boolean');
    expect(result).to.be.false;
    done();
  });
});