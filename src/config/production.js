module.exports = {
  env: 'production',
  db: process.env.DBURI,
  port: process.env.PORT || 4001,
  secret: process.env.SECRET,
};
