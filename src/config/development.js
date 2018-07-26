module.exports = {
  env: 'development',
  db: process.env.DBURI || 'mongodb://127.0.0.1:27017/hackerbay',
  port: process.env.PORT || 4000,
  secret: process.env.SECRET || 'secret',

};
