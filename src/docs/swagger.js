const swagger = require('./swagger.json');
const login = require('./user/login.json');

swagger.paths['/user/login'] = login;

module.exports = swagger;
