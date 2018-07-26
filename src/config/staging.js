module.exports = {
  env: 'staging',
  db: process.env.DBURI || 'mongodb://127.0.0.1:27017/hackerbay',
  port: process.env.PORT || 4002,
  secret: process.env.SECRET || 'secret',
};
