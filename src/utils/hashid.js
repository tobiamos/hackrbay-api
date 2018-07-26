const HashID = {};

HashID.generate = () => {
  const alphabet = '23456789abdegjkmnpqrvwxyz';
  const idLength = 6;
  let result = '';
  for (let index = 0; index < idLength; index += 1) {
    result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return result;
};

HashID.generateUnique = (previous = []) => {
  let retries = 0;
  const maxRetries = 9999;
  let id;
  while (!id && retries < maxRetries) {
    id = HashID.generate();
    if (previous.indexOf(`rc-${id}`) !== -1) {
      id = null;
      retries += 1;
    }
  }
  return id;
};

module.exports = HashID;
