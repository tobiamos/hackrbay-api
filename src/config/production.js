module.exports = {
  env: 'production',
  db: process.env.DB,
  port: process.env.PORT || 4001,
  secret: process.env.SECRET,
};
