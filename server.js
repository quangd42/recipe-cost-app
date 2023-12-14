const debug = require('debug')('app');
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  debug(`Listening to port ${PORT}...`);
});
