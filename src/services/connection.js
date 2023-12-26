const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
// const dbName = 'recipe-cost-app';
const dbName = process.env.MONGODB_NAME;

const connect = async () => {
  try {
    await mongoose.connect(uri, {
      dbName,
    });
    console.log('Connected to MongoDB!');
  } catch (err) {
    console.log(err.stack);
  }
};

const close = async () => {
  await mongoose.connection.close();
};

const getCollection = async (collectionName) => {
  return mongoose.connection.db.collection(collectionName);
};

module.exports = { connect, close, getCollection };
