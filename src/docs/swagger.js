const swagger = require('./swagger.json');
const login = require('./user/login.json');
const patch = require('./patch/jsonpatch.json');

swagger.paths['/user/login'] = login;
swagger.paths['/patch'] = patch;

module.exports = swagger;
