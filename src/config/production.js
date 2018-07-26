module.exports = {
  env: 'production',
  db: process.env.DBURI || 'mongodb://127.0.0.1:27017/hackerbay',
  port: process.env.PORT || 4001,
  secret: process.env.SECRET || 'secret',
};
