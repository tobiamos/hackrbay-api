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
});