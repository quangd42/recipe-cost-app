const { getCollection } = require('./connection');
const { ObjectId } = require('mongodb');

const collectionName = 'users';

const createUser = async (user) => {
  const collection = getCollection(collectionName);
  const res = await collection.insertOne(user);
  return res;
};

const getUser = async (userId) => {
  const collection = getCollection(collectionName);

  const objectId = new ObjectId(userId);
  const res = await collection.findOne({ _id: objectId });

  return res;
};

const getUsers = async () => {
  const collection = getCollection(collectionName);

  const options = {
    sort: { name: 1 },
    projection: { _id: 1, name: 1, email: 1 },
  };

  const res = await collection.find({}, options).toArray();
  return res;
};

const updateUser = async (userId, updates) => {
  const collection = getCollection(collectionName);

  const objectId = new ObjectId(userId);
  const filter = { _id: objectId };
  const updateDoc = {
    $set: updates,
  };

  const res = await collection.updateOne(filter, updateDoc);
  return res;
};

const deleteUser = async (userId) => {
  const collection = getCollection(collectionName);

  const objectId = new ObjectId(userId);
  const filter = { _id: objectId };

  const res = await collection.deleteOne(filter);
  return res;
};

module.exports = {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
};
