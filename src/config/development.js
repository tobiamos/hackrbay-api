module.exports = {
  env: 'development',
  db: process.env.DBURI || 'mongodb://dev:bayhacker16@ds247191.mlab.com:47191/hackerbay',
  port: process.env.PORT || 4000,
  secret: process.env.SECRET || 'secret',

};
